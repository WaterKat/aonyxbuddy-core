









# Canvas Utility Functions

## CreateCanvas Function

Options for the `CreateCanvas` function. Contains style options for the HTML element.

Creates a new canvas with that follows the provided options object. Returns the created canvas.

## DrawImageBitmap Function

Options required for the rendering of images on a canvas context contains dimensions and image data.

Renders an image on the given context.

## ClearCanvas Function

Options used for the clear canvas function.

---
---
# Image Utility Functions

## GetImageBitmaps Function

Parameters for fetching image bitmaps.

Fetches image bitmaps from a list of URLs/base64 strings, as a promise.

## GetGIFAsImageBitmaps Function

Fetches a GIF from a given URL as a promise.

## GetImageBlobFromURL Function

Fetches an image blob from a given URL and returns a promise.

## GetImageBlobFromBase64 Function

Creates an ImageBitmap if the provided string is a valid image format.

## IsBase64 Function

Checks if string is in base64 image format.

## GetBlob Function

Fetches a blob from a given string, either base64 or URL.

## GetImageBitmap Function

Converts a blob to an image bitmap.

---
---
# Rendering Utility Functions

## PopulateIRenderParams Function

Side effect: changes the bitmap array value within each `renderData` object in `renderDatas`.

Uses the fetch resources packages to get bitmaps from the provided URLs or base64 strings. If the fetch function fails at any point, that `renderData` will have an empty array as its bitmaps array.

## RenderParams Function

Side effect: changes the images being displayed on the provided canvas context "ctx".

Renders the bitmaps based on the parameters and the render data. The bitmaps are drawn in the order they are provided in the render data.

## RenderDefaults Function

Side effect: changes the images being displayed on the provided canvas context "ctx".

Renders the bitmaps based on the defaults of the render data provided. This rendering function ignores the "params" array within the `IRenderParams` provided.

---
---
# Legacy Configuration Conversion Functions

## ConvertLegacySpritesToRenderData Function

Converts legacy sprites to render data configuration type.

@param sprites the legacy sprites configuration, containing sprite names and urls of the sprite images.
@returns the render data configuration, containing sprite names, parameter defaults, and the image bitmaps.

## ConvertIfLegacyConfiguration Function

Converts a legacy configuration to the new configuration type.

`legacyConfig` the legacy configuration to convert
@returns the new configuration type

