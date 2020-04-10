const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    signatureVersion: 'v4'
});
const bucketName = process.env.TODOS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export function getUploadUrl(itemKey: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: itemKey,
        Expires: parseInt(urlExpiration)
    });
}