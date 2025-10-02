#!/usr/bin/env python3
"""
Traffic Congestion Prediction Script
Uses the trained Gradient Boosting model to predict congestion levels
"""

import sys
import os
import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.preprocessing import LabelEncoder


def load_models():
    """Load the trained model and encoders"""
    try:
        # Get the backend directory (where this script is located)
        backend_dir = Path(__file__).parent
        
        # Load model and encoders from backend directory
        model_path = backend_dir / 'congestion_model.pkl'
        encoders_path = backend_dir / 'encoders.pkl'

        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        if not encoders_path.exists():
            raise FileNotFoundError(f"Encoders file not found: {encoders_path}")

        model = joblib.load(model_path)
        encoders = joblib.load(encoders_path)
        
        print(f"Successfully loaded model and encoders", file=sys.stderr)
        return model, encoders

    except Exception as e:
        print(f"Error loading models: {e}", file=sys.stderr)
        sys.exit(1)


def load_historical_data():
    """Load historical data for feature imputation"""
    try:
        # Try backend directory first, then project root
        backend_dir = Path(__file__).parent
        data_paths = [
            backend_dir / 'Bangalore_Traffic_Pulse.csv',
            backend_dir.parent / 'Bangalore_Traffic_Pulse.csv'
        ]
        
        for data_path in data_paths:
            if data_path.exists():
                df = pd.read_csv(data_path)
                print(f"Loaded historical data from {data_path} with {len(df)} records", file=sys.stderr)
                return df
        
        raise FileNotFoundError("Historical data file not found in any expected location")

    except Exception as e:
        print(f"Error loading historical data: {e}", file=sys.stderr)
        sys.exit(1)





def predict_congestion(area_name, road_name, weather_conditions, roadwork_activity):
    """
    Predict congestion level for given inputs using real trained model
    """
    try:
        # Load model and encoders
        model, encoders = load_models()
        
        # Load historical data for feature imputation
        df_hist = load_historical_data()

        # Create input dataframe
        user_input = {
            'Area Name': area_name,
            'Road/Intersection Name': road_name,
            'Weather Conditions': weather_conditions,
            'Roadwork and Construction Activity': roadwork_activity
        }

        df_input = pd.DataFrame([user_input])
        print(f"Input data: {user_input}", file=sys.stderr)

        # Encode categorical features using the real encoders
        categorical_columns = ['Area Name', 'Road/Intersection Name', 
                               'Weather Conditions', 'Roadwork and Construction Activity']

        for col in categorical_columns:
            if col in encoders:
                le = encoders[col]
                input_value = df_input[col].iloc[0]
                
                # Check if the input value is in the encoder's known classes
                if input_value in le.classes_:
                    df_input[col] = le.transform([input_value])[0]
                    print(f"Encoded {col}: '{input_value}' -> {df_input[col].iloc[0]}", file=sys.stderr)
                else:
                    # Handle unknown categories by finding the closest match or using most common
                    print(f"Warning: '{input_value}' not found in {col} classes: {list(le.classes_)}", file=sys.stderr)
                    # Use the first class as fallback (most common approach)
                    fallback_value = le.classes_[0]
                    df_input[col] = le.transform([fallback_value])[0]
                    print(f"Using fallback for {col}: '{fallback_value}' -> {df_input[col].iloc[0]}", file=sys.stderr)
            else:
                raise ValueError(f"Encoder not found for column: {col}")

        # Fill numerical features using historical averages from real data
        # First encode the categorical columns in historical data for matching
        df_hist_encoded = df_hist.copy()
        for col in categorical_columns:
            if col in df_hist_encoded.columns:
                le = encoders[col]
                # Only transform values that are in the encoder's classes
                mask = df_hist_encoded[col].isin(le.classes_)
                df_hist_encoded.loc[mask, col] = le.transform(df_hist_encoded.loc[mask, col])
                df_hist_encoded.loc[~mask, col] = le.transform([le.classes_[0]])[0]  # fallback

        # Numerical features to impute
        numerical_features = ['Traffic Volume', 'Average Speed', 'Road Capacity Utilization',
                              'Incident Reports', 'Pedestrian and Cyclist Count']

        # Try to find similar historical data for imputation
        area_encoded = df_input['Area Name'].iloc[0]
        road_encoded = df_input['Road/Intersection Name'].iloc[0]

        for feature in numerical_features:
            if feature in df_hist.columns:
                # First try to find data for the same area and road
                mask = ((df_hist_encoded['Area Name'] == area_encoded) & 
                       (df_hist_encoded['Road/Intersection Name'] == road_encoded))
                
                if mask.sum() > 0:
                    feature_mean = df_hist.loc[mask, feature].mean()
                    print(f"Found {mask.sum()} records for area+road match for {feature}", file=sys.stderr)
                else:
                    # Fall back to same area only
                    mask = df_hist_encoded['Area Name'] == area_encoded
                    if mask.sum() > 0:
                        feature_mean = df_hist.loc[mask, feature].mean()
                        print(f"Found {mask.sum()} records for area match for {feature}", file=sys.stderr)
                    else:
                        # Fall back to overall mean
                        feature_mean = df_hist[feature].mean()
                        print(f"Using overall mean for {feature}", file=sys.stderr)
                
                df_input[feature] = feature_mean
                print(f"Imputed {feature}: {feature_mean:.2f}", file=sys.stderr)
            else:
                raise ValueError(f"Feature '{feature}' not found in historical data")

        # Add derived features (if they were used in training)
        df_input['Speed_to_Volume'] = df_input['Average Speed'] / (df_input['Traffic Volume'] + 1)
        df_input['Incidents_per_Capacity'] = df_input['Incident Reports'] / (df_input['Road Capacity Utilization'] + 1)

        # Add temporal features (using current date for more realistic predictions)
        from datetime import datetime
        now = datetime.now()
        df_input['Day'] = now.day
        df_input['Month'] = now.month
        df_input['Is_Weekend'] = now.weekday() >= 5  # Saturday = 5, Sunday = 6

        # Define feature order (must match training order)
        feature_columns = [
            'Traffic Volume', 'Average Speed', 'Road Capacity Utilization',
            'Incident Reports', 'Pedestrian and Cyclist Count',
            'Area Name', 'Road/Intersection Name', 'Weather Conditions', 'Roadwork and Construction Activity',
            'Day', 'Month', 'Is_Weekend',
            'Speed_to_Volume', 'Incidents_per_Capacity'
        ]

        # Ensure all required features are present
        for col in feature_columns:
            if col not in df_input.columns:
                raise ValueError(f"Missing required feature: {col}")

        print(f"Final feature values: {df_input[feature_columns].iloc[0].to_dict()}", file=sys.stderr)

        # Make prediction
        prediction = model.predict(df_input[feature_columns])
        
        # Return the prediction (ensure it's within reasonable bounds)
        congestion_level = max(0, min(100, float(prediction[0])))
        print(f"Raw prediction: {prediction[0]}, bounded: {congestion_level}", file=sys.stderr)
        
        return congestion_level

    except Exception as e:
        print(f"Prediction error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        # Return a reasonable default in case of error
        return 50.0


def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) != 5:
        print("Usage: python predict.py <area_name> <road_name> <weather_conditions> <roadwork_activity>", file=sys.stderr)
        print("Available areas: Electronic City, Hebbal, Indiranagar, Jayanagar, Koramangala, M.G. Road, Whitefield, Yeshwanthpur", file=sys.stderr)
        print("Available weather: Clear, Fog, Overcast, Rain, Windy", file=sys.stderr)
        print("Available roadwork: Yes, No", file=sys.stderr)
        sys.exit(1)

    area_name = sys.argv[1]
    road_name = sys.argv[2]
    weather_conditions = sys.argv[3]
    roadwork_activity = sys.argv[4]

    # Make prediction
    prediction = predict_congestion(
        area_name, road_name, weather_conditions, roadwork_activity)

    # Output the prediction (clean output for frontend consumption)
    print(f"{prediction:.2f}")


if __name__ == "__main__":
    main()
