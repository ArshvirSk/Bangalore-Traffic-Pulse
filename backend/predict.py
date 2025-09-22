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


def load_models():
    """Load the trained model and encoders"""
    try:
        # Get the project root directory (parent of backend)
        project_root = Path(__file__).parent.parent

        # Load the model and encoders
        model_path = project_root / 'gb_model.pkl'
        encoders_path = project_root / 'label_encoders.pkl'

        if not model_path.exists():
            # Try alternative names
            model_path = project_root / 'congestion_model.pkl'

        if not encoders_path.exists():
            # Try alternative names
            encoders_path = project_root / 'encoders.pkl'

        model = joblib.load(model_path)
        encoders = joblib.load(encoders_path)

        return model, encoders

    except Exception as e:
        print(f"Error loading models: {e}", file=sys.stderr)
        sys.exit(1)


def load_historical_data():
    """Load historical data for feature imputation"""
    try:
        project_root = Path(__file__).parent.parent
        data_path = project_root / 'Bangalore_Traffic_Pulse.csv'

        if data_path.exists():
            df = pd.read_csv(data_path)
            return df
        else:
            # Return dummy data if CSV not found
            return create_dummy_historical_data()

    except Exception as e:
        print(f"Warning: Could not load historical data: {e}", file=sys.stderr)
        return create_dummy_historical_data()


def create_dummy_historical_data():
    """Create dummy historical data for feature imputation"""
    dummy_data = {
        'Area Name': ['Indiranagar', 'Koramangala', 'Whitefield'] * 100,
        'Road/Intersection Name': ['100 Feet Road', '5th Block', 'ITPL Main Road'] * 100,
        'Traffic Volume': np.random.normal(1500, 300, 300),
        'Average Speed': np.random.normal(25, 5, 300),
        'Road Capacity Utilization': np.random.normal(75, 15, 300),
        'Incident Reports': np.random.poisson(2, 300),
        'Pedestrian and Cyclist Count': np.random.normal(50, 10, 300)
    }
    return pd.DataFrame(dummy_data)


def predict_congestion(area_name, road_name, weather_conditions, roadwork_activity):
    """
    Predict congestion level for given inputs
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

        # Encode categorical features
        categorical_columns = ['Area Name', 'Road/Intersection Name',
                               'Weather Conditions', 'Roadwork and Construction Activity']

        for col in categorical_columns:
            if col in encoders:
                le = encoders[col]
                try:
                    # Handle unknown categories
                    if df_input[col].iloc[0] in le.classes_:
                        df_input[col] = le.transform(df_input[col])
                    else:
                        # Use the most frequent class for unknown categories
                        df_input[col] = le.transform([le.classes_[0]])
                except Exception as e:
                    print(
                        f"Warning: Encoding error for {col}: {e}", file=sys.stderr)
                    df_input[col] = 0  # Default value

        # Fill numerical features using historical averages
        numerical_features = ['Traffic Volume', 'Average Speed', 'Road Capacity Utilization',
                              'Incident Reports', 'Pedestrian and Cyclist Count']

        # Try to find similar historical data
        area_encoded = df_input['Area Name'].iloc[0]
        road_encoded = df_input['Road/Intersection Name'].iloc[0]

        # Use default values if historical data matching fails
        default_values = {
            'Traffic Volume': 1500,
            'Average Speed': 25,
            'Road Capacity Utilization': 75,
            'Incident Reports': 2,
            'Pedestrian and Cyclist Count': 50
        }

        for feature in numerical_features:
            if feature in df_hist.columns:
                # Use historical average for the area/road combination
                mask = True  # Start with all data
                if 'Area Name' in df_hist.columns:
                    try:
                        mask = mask & (df_hist['Area Name'] == area_encoded)
                    except:
                        pass

                feature_mean = df_hist.loc[mask, feature].mean(
                ) if mask.sum() > 0 else default_values[feature]

                if pd.isna(feature_mean):
                    feature_mean = default_values[feature]

                df_input[feature] = feature_mean
            else:
                df_input[feature] = default_values[feature]

        # Add derived features
        df_input['Speed_to_Volume'] = df_input['Average Speed'] / \
            (df_input['Traffic Volume'] + 1)
        df_input['Incidents_per_Capacity'] = df_input['Incident Reports'] / \
            (df_input['Road Capacity Utilization'] + 1)

        # Add temporal features (using defaults)
        df_input['Day'] = 15  # Mid-month
        df_input['Month'] = 6  # Mid-year
        df_input['Is_Weekend'] = False

        # Define feature order (must match training order)
        feature_columns = [
            'Traffic Volume', 'Average Speed', 'Road Capacity Utilization',
            'Incident Reports', 'Pedestrian and Cyclist Count',
            'Area Name', 'Road/Intersection Name', 'Weather Conditions', 'Roadwork and Construction Activity',
            'Day', 'Month', 'Is_Weekend',
            'Speed_to_Volume', 'Incidents_per_Capacity'
        ]

        # Make prediction
        prediction = model.predict(df_input[feature_columns])

        # Return the prediction (ensure it's within reasonable bounds)
        congestion_level = max(0, min(100, float(prediction[0])))
        return congestion_level

    except Exception as e:
        print(f"Prediction error: {e}", file=sys.stderr)
        # Return a reasonable default in case of error
        return 50.0


def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) != 5:
        print("Usage: python predict.py <area_name> <road_name> <weather_conditions> <roadwork_activity>", file=sys.stderr)
        sys.exit(1)

    area_name = sys.argv[1]
    road_name = sys.argv[2]
    weather_conditions = sys.argv[3]
    roadwork_activity = sys.argv[4]

    # Make prediction
    prediction = predict_congestion(
        area_name, road_name, weather_conditions, roadwork_activity)

    # Output the prediction
    print(prediction)


if __name__ == "__main__":
    main()
