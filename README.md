# Next.js Photo Blog

An opinionated static photo blog using [Next.js 13](https://nextjs.org/). You can see the photo blog in action at [https://photos.timmyomahony.com](https://photos.timmyomahony.com).

!["A screenshot of the frontpage of the blog at https://photos.timmyomahony.com"](./screenshot.jpg)

If you're interested in running this codebase for yourself, make sure to look through the rest of the readme or [this blog post](https://timmyomahony.com/blog/creating-a-static-next-13-photo-blog/) to get an idea of the (opinionated) approach.

## Requirements

- Node 18
- An S3 or Digital Ocean Spaces account

## Setup

Clone the repo and install dependencies with:

```bash
npm install
```

Make sure to add the required environment variables to `.env.local`:

```env
AWS_ENDPOINT=https://ams3.digitaloceanspaces.com
AWS_REGION=ams3
AWS_BUCKET=timmyomahony-photos
AWS_ACCESS_KEY_ID=
AWS_SECRET=
AWS_SECRET_ACCESS_KEY=https://timmyomahony-photos.ams3.digitaloceanspaces.com/
```

Run it:

```bash
npm run dev
```

## Background

The goal of this project is to make a static photo blog that makes it incredibly easy to publish new content.

I've run a number of small personal photo blogs in the past with CMSs or template-driven apps. Despite my best intentions, content eventually stagnated as I got frustrated having to go through an involved publishing experience every time I want to add new photos.

To avoid these pitfalls, this time around I wanted:

1. As few moving parts as possible.
2. A friction-free publishing experience.

With that in mind, this codebase is opinionated to suit these requirements.

The publishing workflow is intended to be a single step: export images to a folder and let automation handle the rest:

!["Screenshot of photo blog workflow"](https://cdn.timmyomahony.com/assets/screenshot-of-photoblog-workflow.png)

- There are no databases, APIs, servers etc. Everything is static.
- OS automation is used to prepare and upload images to S3 (I'm using MacOS and Hazel).
- Images are storage on S3/DO spaces with a specific folder structure.
- Each folder of images is an "album".
- The folder name contains the date which is used for sorting.
- EXIF metadata is used for image titles, captions, tags etc.

### OS Automation

In order to make publishing as painfree as possible, I use [Hazel](https://www.noodlesoft.com/) on MacOS to automate the preparation and upload of photos to storage.

- I export photos from Lightroom CC at full quality and size to a predefined folder (e.g. `Export`)
- Hazel detects when images are added to this folder and a script `./bin/hazel/process_images.sh` is run each image.
- This script will:
  - Resize the image.
  - Reduce its quality for the web.
  - Create a thumnbail automatically (this will be moved to the codebase in the future)
  - Upload the images to storage.

Photos processed by this script are stored on S3 with the following folder structure:

```sh
/2022-11-15/Name of First Album/Image-01.jpeg
/2022-11-15/Name of First Album/Image-02.jpeg
/2022-11-15/Name of First Album/Image-03.jpeg
/2022-11-15/Name of Second Album/Image-01.jpeg
/2022-11-15/Name of Second Album/Image-02.jpeg
/2022-11-15/Name of Second Album/Image-03.jpeg
...
```

### Website Build

The app itself uses Next.js 13's app directory and server-side components to statically generate all content at build-time. All of the photos are downloaded via the JavaScript AWS SDK and processed.

### Additional data

You can retrospectively add a `data.json` to each album folder, which will be called during builds for additional data belonging to the album. Currenty it's limited to:

```json
{
  "description": "A short description of this album."
}
```

## Roadmap

- [ ] Automate the creation of thumbnails via Next.js metadata/og API.
- [ ] Figure out to automate new builds when all images are exported (this is a shortcoming of Hazel).
