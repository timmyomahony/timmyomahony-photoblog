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
# brew install imagemagick awscli
#
# Resources
# =========
#
# https://imagemagick.org/script/mogrify.php
# https://www.noodlesoft.com/manual/hazel/attributes-actions/using-shell-scripts/
#
# Todo
# ===
#
# Add option for borders with:
#
# mogrify -quality 92 -bordercolor "#ffffff" -border 50 -resize "3072x3072>" $1


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

# Process images
for IMAGE in "$ALBUM_DIR"/*
do
    mogrify -quality "$QUALITY" -resize "$DIMENSIONSx$DIMENSIONS>" "$IMAGE"
done

# Upload to Digital Ocean
export AWS_ACCESS_KEY_ID="$DO_SPACES_ACCESS"
export AWS_SECRET_ACCESS_KEY="$DO_SPACES_SECRET"
aws s3 sync "$ALBUM_DIR" "s3://$DO_SPACES_BUCKET/$TODAY/$ALBUM_NAME" --endpoint-url "$DO_SPACES_ENDPOINT" --acl public-read

# Run Vercel webhook
