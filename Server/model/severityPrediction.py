import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, accuracy_score


def predict(magnitude, cdi, mmi, tsunami, net, dmin, gap, depth):
    # Load data
    df = pd.read_csv("./dataset/cleaned_earthquake.csv")

    # Encode categorical columns
    encoder = LabelEncoder()
    df["net_encoded"] = encoder.fit_transform(df["net"])
    alert_encoder = LabelEncoder()
    df["alert_encoded"] = alert_encoder.fit_transform(df["alert"])

    # Define features and target
    x_sig = df[
        ["magnitude", "cdi", "mmi", "tsunami", "net_encoded", "dmin", "gap", "depth"]
    ]
    y_sig = df["sig"]

    # Split data
    x_sig_train, x_sig_test, y_sig_train, y_sig_test = train_test_split(
        x_sig, y_sig, random_state=42
    )

    # Train model
    sig_model = RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
    )
    sig_model.fit(x_sig_train, y_sig_train)
    sig_prediction = sig_model.predict(x_sig_test)

    # Getting performance
    r2 = r2_score(y_sig_test, sig_prediction)
    mae = mean_absolute_error(y_sig_test, sig_prediction)
    print("=========== Sig ===========")
    print("R2 Score:", r2)
    print("Mean Absolute Error:", mae)

    # Alert prediction
    x_alert = df[
        [
            "magnitude",
            "cdi",
            "mmi",
            "tsunami",
            # "sig",
            "net_encoded",
            "dmin",
            "gap",
            "depth",
        ]
    ]
    y_alert = df["alert_encoded"]

    x_alert_train, x_alert_test, y_alert_train, y_alert_test = train_test_split(
        x_alert, y_alert, random_state=42
    )

    alert_model = RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
    )
    alert_model.fit(x_alert_train, y_alert_train)
    alert_prediction = alert_model.predict(x_alert_test)

    alert_accuracy = accuracy_score(y_alert_test, alert_prediction)
    print("=========== Alert ===========")
    print(f"Accuracy: {(alert_accuracy * 100):.2f}%")

    net_mapping = dict(zip(df["net"], df["net_encoded"]))

    # Get the encoded value for the input net
    if net in net_mapping:
        net_encoded_value = net_mapping[net]
    else:
        # If the net value is not in training data, use the most common encoded value
        net_encoded_value = df["net_encoded"].mode()[0]

    new_data = pd.DataFrame(
        {
            "magnitude": [magnitude],
            "cdi": [cdi],
            "mmi": [mmi],
            "tsunami": [tsunami],
            "net_encoded": [net_encoded_value],
            "dmin": [dmin],
            "gap": [gap],
            "depth": [depth],
        }
    )

    print(new_data.head())

    new_sig_prediction = sig_model.predict(new_data)

    # Create new_data_alert with columns in the EXACT same order as x_alert
    new_data_alert = pd.DataFrame(
        {
            "magnitude": [magnitude],
            "cdi": [cdi],
            "mmi": [mmi],
            "tsunami": [tsunami],
            # "sig": [new_sig_prediction[0]],
            "net_encoded": [net_encoded_value],
            "dmin": [dmin],
            "gap": [gap],
            "depth": [depth],
        }
    )

    new_alert_prediction = alert_model.predict(new_data_alert)

    # Decode the alert prediction back to text
    alert_text = alert_encoder.inverse_transform(new_alert_prediction)[0]

    return alert_text
