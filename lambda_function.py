import json
import base64
import boto3
import uuid
from datetime import datetime

def lambda_handler(event, context):
    print("=== LAMBDA FUNCTION INVOKED ===")
    print("Event received:", json.dumps(event, default=str))
    
    # Handle CORS preflight OPTIONS request
    if event.get('httpMethod') == 'OPTIONS':
        print("Handling OPTIONS request")
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Requested-With',
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': json.dumps({'status': 'OK'})
        }
    
    try:
        # Parse request body
        body = event.get('body', '{}')
        print(f"Raw body length: {len(body)}")
        
        if event.get('isBase64Encoded', False):
            body = base64.b64decode(body).decode('utf-8')
            print("Decoded base64 body")
        
        data = json.loads(body) if body else {}
        print(f"Parsed data keys: {list(data.keys())}")
        
        # Check if image data is present
        if 'image' not in data:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Requested-With'
                },
                'body': json.dumps({
                    'error': 'No image data provided',
                    'message': 'Please provide a base64 encoded image in the request body'
                })
            }
        
        image_data = data['image']
        print(f"Image data received, length: {len(image_data)}")
        
        # Decode base64 image
        try:
            if ',' in image_data:
                image_data = image_data.split(',')[1]
                print("Removed data URL prefix")
            
            image_bytes = base64.b64decode(image_data)
            print(f"Image decoded successfully, size: {len(image_bytes)} bytes")
        except Exception as e:
            print(f"Base64 decode error: {str(e)}")
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Invalid image data',
                    'message': 'Please provide a valid base64 encoded image'
                })
            }
        
        # Validate image size (5MB limit for Rekognition)
        if len(image_bytes) > 5242880:
            print(f"Image too large: {len(image_bytes)} bytes")
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Image too large',
                    'message': 'Image size exceeds 5MB limit. Please upload a smaller image.'
                })
            }
        
        # Initialize Rekognition client
        try:
            rekognition = boto3.client('rekognition')
            print("Rekognition client initialized successfully")
        except Exception as e:
            print(f"Rekognition client error: {str(e)}")
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Rekognition service unavailable',
                    'message': 'Failed to initialize Rekognition client'
                })
            }
        
        # REPLACE THIS WITH YOUR ACTUAL MODEL ARN
        MODEL_ARN = 'arn:aws:rekognition:ap-south-1:035786426534:project/brain_tumour/version/brain_tumour.2025-10-25T17.17.26/1761392846075'
        
        print(f"Using Model ARN: {MODEL_ARN}")
        
        # Call Rekognition Custom Labels
        try:
            print("Calling Rekognition DetectCustomLabels...")
            response = rekognition.detect_custom_labels(
                ProjectVersionArn=MODEL_ARN,
                Image={
                    'Bytes': image_bytes
                },
                MaxResults=10,
                MinConfidence=20.0  # Minimum confidence threshold
            )
            
            print("Rekognition response received successfully")
            print(f"Number of labels detected: {len(response.get('CustomLabels', []))}")
            
        except rekognition.exceptions.ResourceNotFoundException:
            print("Model not found or not running")
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Model not available',
                    'message': 'Rekognition model is not found or not running. Please check model status.'
                })
            }
        except rekognition.exceptions.ResourceNotReadyException:
            print("Model not ready")
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Model not ready',
                    'message': 'Rekognition model is still loading. Please try again in a few minutes.'
                })
            }
        except Exception as e:
            print(f"Rekognition API error: {str(e)}")
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Rekognition service error',
                    'message': f'Failed to analyze image: {str(e)}'
                })
            }
        
        # Process Rekognition results
        custom_labels = response.get('CustomLabels', [])
        
        if custom_labels:
            # Sort labels by confidence (highest first)
            sorted_labels = sorted(custom_labels, key=lambda x: x['Confidence'], reverse=True)
            highest_confidence_label = sorted_labels[0]
            
            print(f"Highest confidence label: {highest_confidence_label['Name']} ({highest_confidence_label['Confidence']:.2f}%)")
            
            response_data = {
                'tumor_type': highest_confidence_label['Name'],
                'confidence': round(highest_confidence_label['Confidence'], 2),
                'all_predictions': [
                    {
                        'label': label['Name'],
                        'confidence': round(label['Confidence'], 2)
                    } for label in sorted_labels
                ],
                'analysis_id': str(uuid.uuid4()),
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'message': 'Image analyzed successfully using Rekognition Custom Labels'
            }
        else:
            # No labels detected
            print("No custom labels detected - classifying as no_tumor")
            response_data = {
                'tumor_type': 'no_tumor',
                'confidence': 100.0,
                'all_predictions': [],
                'analysis_id': str(uuid.uuid4()),
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'message': 'No tumors detected in the image'
            }
        
        print(f"Returning real response: {response_data['tumor_type']} with {response_data['confidence']}% confidence")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Requested-With',
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        print(f"UNEXPECTED ERROR: {str(e)}")
        import traceback
        print(f"TRACEBACK: {traceback.format_exc()}")
        
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Requested-With'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e),
                'details': 'Check Lambda logs for more information'
            })
        }