import boto3
import hashlib
from botocore.exceptions import ClientError

session = boto3.Session(
    aws_access_key_id=os.getenv("S3_ACCESS_KEY_ID")
    aws_secret_access_key=os.getenv("S3_SECRET_ACCESS_KEY")
)
s3     = session.resource('s3')
bucket = s3.Bucket('cab-cs467-images')

# Retrieve image

# Store image
def store_image(image_blob, file_type):
    try:
        key = hashlib.sha256(image_blob).hexdigest() + '.' + file_type
        response = bucket.upload_fileobj(image_blob, key)
    except ClientError:
        return FALSE
    return TRUE

# Delete images
# Expects a list of hashes containing keys of images to delete [ { 'Key': 'string' }, ... ]
def delete_images(images):
    try:
        response = bucket.delete_objects(
            Delete={
                'Objects': images
            }
        )
    except ClientError:
        return FALSE
    return TRUE
