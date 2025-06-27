import os
import pandas as pd
import numpy as np

def analyze_missing_data(df):
    """Analyze missing data patterns"""
    missing_stats = {}
    for col in df.columns:
        missing_count = df[col].isnull().sum()
        missing_percentage = (missing_count / len(df)) * 100
        missing_stats[col] = {
            'missing_count': missing_count,
            'missing_percentage': missing_percentage
        }
    return missing_stats

def handle_high_missing_data(df, threshold=70):
    """Handle datasets with high missing data percentages"""
    print("Analyzing missing data patterns...")
    missing_stats = analyze_missing_data(df)
    
    # Print missing data statistics
    for col, stats in missing_stats.items():
        print(f"{col}: {stats['missing_percentage']:.1f}% missing ({stats['missing_count']} values)")
    
    # Strategy 1: Drop columns with too much missing data
    columns_to_drop = []
    for col, stats in missing_stats.items():
        if stats['missing_percentage'] > threshold:
            columns_to_drop.append(col)
            print(f"Dropping column '{col}' due to {stats['missing_percentage']:.1f}% missing data")
    
    df_processed = df.drop(columns=columns_to_drop)
    
    # Strategy 2: Drop rows where ALL remaining columns are null
    df_processed = df_processed.dropna(how='all')
    
    # Strategy 3: For remaining columns, use different strategies based on missing percentage
    for col in df_processed.columns:
        missing_pct = (df_processed[col].isnull().sum() / len(df_processed)) * 100
        
        if missing_pct > 0:
            if df_processed[col].dtype in [np.float64, np.int64]:
                # For numeric columns
                if missing_pct < 30:
                    # Use median for moderate missing data
                    df_processed[col] = df_processed[col].fillna(df_processed[col].median())
                else:
                    # Use forward fill + backward fill for high missing data
                    df_processed[col] = df_processed[col].fillna(method='ffill').fillna(method='bfill')
                    # If still missing, use median
                    df_processed[col] = df_processed[col].fillna(df_processed[col].median())
            else:
                # For categorical columns
                mode_value = df_processed[col].mode()
                if not mode_value.empty:
                    df_processed[col] = df_processed[col].fillna(mode_value[0])
                else:
                    df_processed[col] = df_processed[col].fillna('Unknown')
    
    return df_processed

def clean_data(file_path):
    cleaned_file_path = 'dataset/cleaned_earthquake.csv'
    
    # Check if cleaned file already exists
    if os.path.exists(cleaned_file_path):
        print("Cleaned file already exists, skipping data cleaning process.")
        return cleaned_file_path
    
    # Load the dataset
    df = pd.read_csv(file_path)
    
    print(f"Original dataset shape: {df.shape}")
    total_cells = df.shape[0] * df.shape[1]
    missing_cells = df.isnull().sum().sum()
    missing_percentage = (missing_cells / total_cells) * 100
    print(f"Overall missing data: {missing_percentage:.1f}% ({missing_cells} out of {total_cells} cells)")
    
    # Columns to delete
    columns_to_delete = ['title', 'date_time', 'magType', 'latitude', 'longitude', 'location', 'continent', 'country', 'nst']
    
    # Drop the specified columns
    df_cleaned = df.drop(columns=columns_to_delete, errors='ignore')
    
    # Handle high missing data
    df_cleaned = handle_high_missing_data(df_cleaned, threshold=70)
    
    print(f"Final cleaned dataset shape: {df_cleaned.shape}")
    final_missing = df_cleaned.isnull().sum().sum()
    print(f"Missing values after cleaning: {final_missing}")
    
    # Save the cleaned data to a new file
    df_cleaned.to_csv(cleaned_file_path, index=False)
    
    print(f"Data cleaned and saved to: {cleaned_file_path}")
    return cleaned_file_path
