A static photo blog using Next.js.


## Uploading images

The photoblog expects to find albums of images in the remote Digital Ocean Space in the format:

```txt
/2022-11-15/Name of First Album/Image-01.jpeg
/2022-11-15/Name of First Album/Image-02.jpeg
/2022-11-15/Name of First Album/Image-03.jpeg
/2022-11-15/Name of Second Album/Image-01.jpeg
/2022-11-15/Name of Second Album/Image-02.jpeg
/2022-11-15/Name of Second Album/Image-03.jpeg
...
```

In order to easily do this, I've configured [Hazel](https://www.noodlesoft.com/) to run a script `./bin/hazel/process_images.sh` on a folder.

When a new subfolder of images are exported from Lightroom to a watched folder, they get:

1. Resized to web-friendly resolutions and qualities
2. New thumbnails are created
3. Uploaded to Digital Ocean

A Vercel webhook is then called to re-build the website.

### Additional data

You can retrospectively add a `data.json` to each album folder, which will be called during builds for additional data belonging to the album. Currenty it's limited to:

```json
{
    description: "A short description of this album."
}
```

### Configuration

To set this up

#### Add Environment Variables

```env
AWS_ENDPOINT=https://ams3.digitaloceanspaces.com
AWS_REGION=ams3
AWS_BUCKET=timmyomahony-photos
AWS_ACCESS_KEY_ID=
AWS_SECRET=
AWS_SECRET_ACCESS_KEY=https://timmyomahony-photos.ams3.digitaloceanspaces.com/
```

#### Setup an AWS profile

AWS CLI seems to give priority to any `~/.aws/credentials` settings before looking at environment variables, so we need to create a custom `personal` profile:

```txt
[default]
...

[personal]
aws_access_key_id = ...
aws_secret_access_key = ...
```

Now you can run the `./bin/hazel/process_albums.sh`.
