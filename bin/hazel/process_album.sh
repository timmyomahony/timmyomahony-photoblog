#!/bin/zsh

# Process album
#
# This script is launched via Hazel, where $1 is the folder name of a new album
# exported via Lightroom. The folder itself should be the name of the new album
# for example "Misty Morning in Glasgow"
#
# The contents of this folder should looks like:
#
# ./Image-01.jpg
# ./Image-02.jpg
# ./...
#
# These jpegs should be at 100% quality and dimensions.
#
# The script will scale the images down then upload them to a folder in
# Digital Ocean, finally the script will call a webhook to rebuild the site.
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

ALBUM_DIR=$1
ALBUM_NAME=$(basename "$ALBUM_DIR")
TODAY=$(date '+%Y-%m-%d')
SCRIPT_DIR=$(realpath "$0")
BIN_DIR=$(dirname "$(dirname "$SCRIPT_DIR")")
APP_DIR=$(dirname "$BIN_DIR")
ENV_FILE="${APP_DIR%/}/.env.local"

DIMENSIONS=2048
QUALITY=95

source ~/.zshrc
source "$ENV_FILE"

# Create thumbnails folder
THUMBNAIL_DIR="${ALBUM_DIR%/}/Thumbnails/"
if [ ! -d "$THUMBNAIL_DIR" ]; then
    mkdir -p "$THUMBNAIL_DIR"
fi

for IMAGE_PATH in "$ALBUM_DIR"/*.{jpg,jpeg};
do
    if [ -f "$IMAGE_PATH" ]; then
        # Reduce quality of images for web
        mogrify -quality "$QUALITY" -resize "$DIMENSIONSx$DIMENSIONS>" "$IMAGE_PATH"

        # Create social media thumbnail
        THUMBNAIL_FILENAME=$(basename "$IMAGE_PATH")
        THUMBNAIL_PATH="${THUMBNAIL_DIR%/}/$THUMBNAIL_FILENAME"
        convert "$IMAGE_PATH" -quality 95 -resize "1200x630^" -gravity "center" -extent "1200x630" "$THUMBNAIL_PATH"
        mogrify -bordercolor white -border "20x20" "$THUMBNAIL_PATH"
        exiftool -TagsFromFile "$IMAGE_PATH" -all:all -overwrite_original "$THUMBNAIL_PATH"
    fi
done

# Upload to Digital Ocean
aws s3 sync "$ALBUM_DIR" "s3://$AWS_BUCKET/$TODAY/$ALBUM_NAME" --endpoint-url "$AWS_ENDPOINT" --acl public-read

# Run Vercel webhook
