#!/bin/zsh

# Process Image
#
# This script is launched via Hazel, where $1 is the path of a new image
# exported via Lightroom to a monitored folder.
#
# The containing folder for the image should be the album and its date, in the
# format "2023-01-01 Misty Morning in Glasgow"
#
# These jpegs should be at 100% quality and dimensions. The script will scale
# the images down then upload them to a folder in Digital Ocean.
#
# Dependencies
# ============
#
# brew install imagemagick awscli exiftool
#
# Resources
# =========
#
# https://imagemagick.org/script/mogrify.php
# https://www.noodlesoft.com/manual/hazel/attributes-actions/using-shell-scripts/
# http://www.imagemagick.org/script/command-line-processing.php#geometry

IMAGE_PATH=$1
IMAGE_FILENAME="${IMAGE_PATH##*/}"
IMAGE_EXTENSION="${IMAGE_PATH##*.}"
ALBUM_PATH="${IMAGE_PATH%/$IMAGE_FILENAME}"
LAST_FOLDER="${ALBUM_PATH##*/}"
RELATIVE_IMAGE_PATH="$LAST_FOLDER/$IMAGE_FILENAME"

THUMBNAIL_DIR="$ALBUM_PATH/Thumbnails"
THUMBNAIL_PATH="$THUMBNAIL_DIR/$IMAGE_FILENAME"
RELATIVE_THUMBNAIL_PATH="$LAST_FOLDER/Thumbnails/$IMAGE_FILENAME"

SCRIPT_DIR=$(realpath "$0")
BIN_DIR=$(dirname "$(dirname "$SCRIPT_DIR")")
APP_DIR=$(dirname "$BIN_DIR")
ENV_FILE="${APP_DIR%/}/.env.local"

source ~/.zshrc
source "$ENV_FILE"

# Skip thumbnail images
if [[ $IMAGE_PATH == *"Thumbnails"*  ]]; then
    return 0;
fi

if [ ! -d "$THUMBNAIL_DIR" ]; then
    mkdir -p "$THUMBNAIL_DIR"
fi

# Prepare images for the web
mogrify -quality 95 -resize "2048x2048" "$IMAGE_PATH"

# Create social media thumbnail
convert "$IMAGE_PATH" -quality 100 -resize "1200x630^" -gravity "center" -extent "1200x630" "$THUMBNAIL_PATH"
mogrify -bordercolor white -border "20x20" "$THUMBNAIL_PATH"
exiftool -TagsFromFile "$IMAGE_PATH" -all:all -overwrite_original "$THUMBNAIL_PATH"

# Upload files
#
# NOTE: This command is using a local profile configured in ~/.aws/credentials
# called "personal". You need to either create this profile manually or remove
# the `--profile` flag altogether.
aws s3 cp "$IMAGE_PATH" "s3://$AWS_BUCKET/$RELATIVE_IMAGE_PATH" --endpoint-url "$AWS_ENDPOINT" --acl public-read --profile personal
aws s3 cp "$THUMBNAIL_PATH" "s3://$AWS_BUCKET/$RELATIVE_THUMBNAIL_PATH" --endpoint-url "$AWS_ENDPOINT" --acl public-read --profile personal
