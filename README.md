# sharex-cf-worker
Cloudflare Worker with R2 storage for image/file hosting.

## Worker Installation
Create a cloudflare worker and R2 Storage.
Configure the wrangler.toml file to your liking.
Create an **ENCRYPTED** environment variable in your worker panel called "AUTHORIZATION_KEY" with a secure random key.

## ShareX installation
Create a Custom Uploader in the sharex app
Set the "Method" to POST.
Add a header called AUTH with your Random key from the worker installation.
Set the "Body" option to Binary.
Set the URL entry at the bottom to "{response}".

### Endpoint Documentation

POST "/"
Body: the file you want to upload.
Headers:
  Auth = Your Authorization Key.

GET "/{imageId}"
Returns the image.