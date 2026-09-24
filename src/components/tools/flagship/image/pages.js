export const HUB_PATH = '/tools/image-converter';
export const HEIC_JPG = '/tools/heic-to-jpg';
export const HEIC_NOUPLOAD = '/tools/heic-to-jpg-without-uploading';
export const HEIC_PNG = '/tools/heic-to-png';
export const RAW_JPG = '/tools/raw-to-jpg';
export const CR2_JPG = '/tools/cr2-to-jpg';
export const NEF_JPG = '/tools/nef-to-jpg';
export const ARW_JPG = '/tools/arw-to-jpg';
export const DNG_JPG = '/tools/dng-to-jpg';

const meta = (from, to) => `Convert ${from} to ${to} in your browser. Batch conversion, EXIF preserved, optional GPS removal. Your photos never leave your device. Free, no sign-up.`;

const RELATED = [
  { to: '/tools/color-converter', label: 'Colour Converter', description: 'Convert HEX, RGB and HSL colour values.' },
  { to: '/tools/base64-tool', label: 'Base64 Encoder', description: 'Encode small images as Base64 for CSS or email.' },
  { to: '/screen-resolution', label: 'Screen Resolution Checker', description: 'Check your display size before you choose a target size.' },
];

const SIBLINGS = [
  { to: HUB_PATH, label: 'Image converter (all formats)' },
  { to: HEIC_JPG, label: 'HEIC to JPG' },
  { to: HEIC_NOUPLOAD, label: 'HEIC to JPG without uploading' },
  { to: HEIC_PNG, label: 'HEIC to PNG' },
  { to: RAW_JPG, label: 'RAW to JPG' },
  { to: CR2_JPG, label: 'CR2 to JPG (Canon)' },
  { to: NEF_JPG, label: 'NEF to JPG (Nikon)' },
  { to: ARW_JPG, label: 'ARW to JPG (Sony)' },
  { to: DNG_JPG, label: 'DNG to JPG' },
];

const PRIVACY_FAQ = { q: 'Are my photos uploaded to a server?', a: 'No. Decoding and conversion run in your browser using WebAssembly, and the photos never leave your device. The site records only an anonymous count of conversions with the formats involved and a rough batch size, never an image, a file name or any metadata.' };
const BATCH_FAQ = { q: 'Can I convert many photos at once?', a: 'Yes. Drop as many as you like (up to 300 on a computer, 25 on a phone, where memory is tighter). They are converted several at a time in background threads, each one reports its own result, and a failed file does not stop the rest. Download them individually or as one zip.' };
const GPS_FAQ = { q: 'Will my photos still contain their location?', a: 'By default the JPEG keeps its metadata, including GPS coordinates if the photo has them, and any photo with a location is flagged. Choose “Remove location” to delete only the GPS data and keep the date, camera and lens, or “Remove all” to strip everything.' };

const COLOUR_SECTION = {
  heading: 'Colour profiles: why converted photos can look flat',
  paragraphs: ['Modern iPhones and many cameras record colour in a wider range than the sRGB standard the web and most software assume. A photo in Display P3, for example, stores numbers that only mean the right colour in P3. Writing those numbers straight into a JPEG that is then read as sRGB makes reds and greens look washed out. This converter reads the embedded colour profile and converts the pixels to sRGB properly before saving, so the colours you see after conversion match the original as closely as sRGB allows. Colours outside the sRGB range are clipped to its edge.'],
};

const EXIF_SECTION = {
  heading: 'Metadata: what is kept, and the location switch',
  paragraphs: ['A JPEG written by this tool keeps the metadata that matters: the date the photo was taken, the camera make and model, the lens, exposure time, aperture, ISO, focal length and orientation. GPS coordinates are kept only if you leave metadata on “Keep everything”, and any photo that contains a location is marked with a GPS badge so it is never a surprise. Choose “Remove location” to delete just the coordinates, or “Remove all” to write a JPEG with no metadata at all. Maker notes and thumbnails are not copied. PNG and WebP output do not carry the EXIF block.'],
};

const common = {
  category: 'Photo · Converters',
  applicationCategory: 'MultimediaApplication',
  related: RELATED,
  siblingsHeading: 'Image converters',
};

const page = ({
  path, slug, title, h1, crumb, from, to, lead, keyword, sections, faqs, focus, defaultFormat, description,
}) => ({
  ...common,
  path,
  toolId: slug,
  slug,
  title,
  description: description || meta(from, to),
  h1,
  crumb,
  appName: h1,
  primaryKeyword: keyword,
  lead,
  focus,
  defaultFormat,
  sections,
  steps: ['Drop your photos onto the box, or tap to choose them.', 'Pick the output format, quality and size, and decide what to do with location data.', 'Click Convert.', 'Download each photo, or everything as one zip.'],
  faqs: [...faqs, BATCH_FAQ, PRIVACY_FAQ],
  siblings: SIBLINGS.filter((s) => s.to !== path),
});

const heicToJpg = page({
  path: HEIC_JPG,
  slug: 'heic-to-jpg',
  title: 'HEIC to JPG — Free, No Upload, In Your Browser',
  h1: 'HEIC to JPG Converter',
  crumb: 'HEIC to JPG',
  from: 'HEIC',
  to: 'JPG',
  keyword: 'heic to jpg',
  focus: 'heic',
  defaultFormat: 'jpg',
  lead: 'This HEIC to JPG converter turns iPhone photos into ordinary JPG files that open everywhere, right in your browser. Convert one photo or hundreds, keep the date and camera details, and choose whether to remove the location — your photos never leave your device.',
  sections: [
    {
      heading: 'How to convert HEIC to JPG',
      paragraphs: ['Drop your HEIC photos onto the box, or tap it on a phone to choose them from your library. Leave the format on JPEG, set the quality (90 is a good default) and click Convert. Each photo is decoded with a WebAssembly build of libheif, converted to sRGB and encoded with MozJPEG. Download files one by one or as a single zip.'],
    },
    {
      heading: 'What HEIC is, and why your iPhone uses it',
      paragraphs: [
        'HEIC is Apple’s name for HEIF images compressed with HEVC, the codec behind H.265 video. Apple made it the default photo format for iPhones with iOS 11 in 2017 because it stores the same picture in roughly half the space of a JPEG, and it can hold extra data such as depth information for Portrait mode, and more than eight bits per colour channel.',
        'The catch is compatibility. Windows needs installed extensions to open HEIC, and HEVC-coded images may need a separate video codec extension; many websites, forms and older apps refuse HEIC files entirely. Converting to JPG makes a photo work anywhere. You can also make the iPhone shoot JPEG by choosing Most Compatible under Settings, Camera, Formats.',
      ],
    },
    {
      heading: 'What is kept and what is lost converting HEIC to JPG',
      list: [
        'Kept: the picture itself, converted to sRGB, at the original size unless you choose to shrink it.',
        'Kept, if you choose: date taken, camera, lens, exposure settings and, optionally, GPS location.',
        'Lost: the extra bit depth, because JPEG is 8 bits per channel.',
        'Lost: Live Photo video, depth maps and other auxiliary data stored alongside the image.',
        'Changed: file size. A JPEG at quality 90 is usually larger than the HEIC it came from.',
      ],
    },
    COLOUR_SECTION,
    EXIF_SECTION,
  ],
  faqs: [
    { q: 'How do I convert HEIC to JPG for free?', a: 'Drop the HEIC files onto this page and click Convert. It is free, has no watermark or file-count limit beyond the batch size, and needs no account.' },
    { q: 'Why can’t I open HEIC files on my PC?', a: 'HEIC needs codec support that Windows does not always include; you may need HEIF and HEVC extensions from the Microsoft Store. Converting to JPG avoids the problem.' },
    GPS_FAQ,
  ],
});

const heicNoUpload = page({
  path: HEIC_NOUPLOAD,
  slug: 'heic-to-jpg-without-uploading',
  title: 'HEIC to JPG Without Uploading — Private Converter',
  h1: 'Convert HEIC to JPG Without Uploading',
  crumb: 'HEIC to JPG without uploading',
  from: 'HEIC',
  to: 'JPG',
  keyword: 'heic to jpg without uploading',
  focus: 'heic',
  defaultFormat: 'jpg',
  description: 'Convert HEIC to JPG without uploading: photos are converted in your browser, EXIF preserved, optional GPS removal. Nothing leaves your device. Free.',
  lead: 'Want to convert HEIC to JPG without uploading your photos to someone else’s server? This converter does the work inside your browser, so the pictures stay on your device from start to finish. It is free, works on phones and computers, and can strip your location.',
  sections: [
    {
      heading: 'Why convert HEIC to JPG without uploading',
      paragraphs: [
        'Most online HEIC converters work by sending your photos to a server, converting them there and sending the result back. That means copies of your pictures — often of family, children, documents and your home — pass through, and may be stored on, a company’s machines. Personal photos also carry hidden data: the exact coordinates where they were taken, the time and the device.',
        'Converting in the browser removes the upload altogether. The photo is read from your device, decoded and re-encoded by code running on your device, and written back to your device. There is no server copy to leak, keep or be asked for.',
      ],
    },
    {
      heading: 'How you can check that nothing is uploaded',
      list: [
        'Open your browser’s developer tools, choose the Network tab and convert a photo. You will see no request carrying your image.',
        'Turn on aeroplane mode after the page has loaded and the first photo has converted; the converter keeps working, because it needs no server.',
        'The only network activity is loading the page and the decoder, and an anonymous counter that records the format and a rough batch size — never an image, a name or metadata.',
      ],
    },
    {
      heading: 'How to convert HEIC to JPG offline and privately',
      paragraphs: ['Open this page while you are online and drop one photo, which loads the decoder into your browser. After that you can convert further batches without a connection. Choose “Remove location” before converting if you plan to share the results, because location data is the most revealing thing a photo carries.'],
    },
    COLOUR_SECTION,
    EXIF_SECTION,
  ],
  faqs: [
    { q: 'How can a website convert HEIC without uploading?', a: 'By running the decoder in your browser. This converter uses libheif compiled to WebAssembly to read the HEIC file, and a JPEG encoder to write the result, all on your own device.' },
    { q: 'Does it work offline?', a: 'Yes, once the page and the decoder have loaded. Drop one photo while online to load the decoder, and it will keep working without a connection.' },
    GPS_FAQ,
  ],
});

const heicToPng = page({
  path: HEIC_PNG,
  slug: 'heic-to-png',
  title: 'HEIC to PNG Converter — Free, No Upload',
  h1: 'HEIC to PNG Converter',
  crumb: 'HEIC to PNG',
  from: 'HEIC',
  to: 'PNG',
  keyword: 'heic to png',
  focus: 'heic',
  defaultFormat: 'png',
  lead: 'This HEIC to PNG converter turns iPhone photos into lossless PNG files in your browser, with colours converted properly to sRGB. Nothing is uploaded, and you can convert a whole batch and download a zip.',
  sections: [
    {
      heading: 'How to convert HEIC to PNG',
      paragraphs: ['Drop your HEIC photos, choose PNG as the format (already selected on this page) and click Convert. PNG has no quality setting, because it is lossless: every pixel of the decoded image is stored exactly. You can still shrink the longest side if you need smaller files.'],
    },
    {
      heading: 'HEIC vs PNG: when PNG is the right choice',
      list: [
        'You need no further quality loss: PNG is lossless, so editing and re-saving does not degrade the picture.',
        'You are working with a screenshot, a diagram or an image with text or sharp edges, where JPEG can leave artefacts.',
        'The next tool in your workflow accepts PNG but not HEIC or does not want a lossy format.',
      ],
    },
    {
      heading: 'The trade-offs',
      paragraphs: ['For photographs PNG files are much larger than JPEG or HEIC — often several times the size — because lossless compression cannot exploit the way a JPEG discards detail you would not notice. If you only need a photo that opens everywhere, the HEIC to JPG converter gives a far smaller file. PNG output also does not carry the camera and location metadata; use JPEG if you want the EXIF kept.'],
    },
    COLOUR_SECTION,
  ],
  faqs: [
    { q: 'How do I convert HEIC to PNG?', a: 'Drop the HEIC files here and click Convert with PNG selected. The photos are decoded in your browser and written as lossless PNG files.' },
    { q: 'Why are the PNG files so big?', a: 'Because PNG is lossless. A photograph has a lot of fine detail that lossless compression cannot shrink much, so PNG files can be many times larger than the JPEG of the same photo.' },
    { q: 'Is the metadata kept in a PNG?', a: 'No. This tool writes camera, date and location information only into JPEG output. If you need the metadata, convert to JPEG.' },
  ],
});

const rawToJpg = page({
  path: RAW_JPG,
  slug: 'raw-to-jpg',
  title: 'RAW to JPG Converter — Batch, Free, No Upload',
  h1: 'RAW to JPG Converter',
  crumb: 'RAW to JPG',
  from: 'RAW',
  to: 'JPG',
  keyword: 'raw to jpg',
  focus: 'raw',
  defaultFormat: 'jpg',
  lead: 'This RAW to JPG converter turns camera RAW files — Canon CR2 and CR3, Nikon NEF, Sony ARW, Adobe DNG and more — into JPGs in your browser, in a batch, with your choice of a near-instant embedded preview or a full-quality decode. Your photos are never uploaded.',
  sections: [
    {
      heading: 'How to convert RAW to JPG',
      paragraphs: ['Drop your RAW files onto the box. Choose Quick to cut the JPEG preview out of each file — almost instant — or Full quality to develop the sensor data itself, which is slower but gives the full resolution. Then choose the output format and metadata options and click Convert.'],
    },
    {
      heading: 'Quick versus full quality',
      paragraphs: [
        'Every RAW file contains a JPEG preview that the camera made for its own screen. Quick mode extracts it, so a 30-megapixel file converts in a fraction of a second. How good that preview is depends on the camera: in our tests a Canon EOS 5D Mark IV CR2 held a full-size 6720×4480 preview and a Nikon Z 6 NEF a full-size 6048×4024 one, but a Sony a7 III ARW held only 1616×1080 and a Ricoh GR III DNG only 720×480.',
        'Full quality ignores the preview and demosaics the sensor data with LibRaw at full resolution, applying the camera’s white balance and converting to sRGB. It takes seconds per file and uses much more memory, so it suits a few important photos rather than a whole shoot.',
      ],
    },
    {
      heading: 'What RAW to JPG conversion loses',
      list: [
        'Bit depth: RAW files hold 12 or 14 bits per channel; JPEG keeps 8.',
        'Editing latitude: exposure, white balance and highlight recovery are baked in. Keep the RAW file if you may want to edit later.',
        'Camera-specific processing: a full decode applies LibRaw’s rendering, which can differ from the camera’s own JPEG look.',
      ],
    },
    {
      heading: 'Supported RAW formats',
      paragraphs: ['Canon CR2, CR3 and CRW; Nikon NEF and NRW; Sony ARW, SRF and SR2; Adobe DNG; Fujifilm RAF; Panasonic RW2; Olympus and OM System ORF; Pentax PEF; Samsung SRW and others. Quick mode works on any file that contains a JPEG preview; Full quality relies on LibRaw’s support for the specific camera.'],
    },
    EXIF_SECTION,
  ],
  faqs: [
    { q: 'How do I convert RAW to JPG for free?', a: 'Drop the RAW files here, choose Quick or Full quality and click Convert. It is free, runs in your browser and has no watermark.' },
    { q: 'Why is my converted photo smaller than the original?', a: 'In Quick mode the JPEG is the preview stored in the RAW file, and some cameras store a preview smaller than the full sensor size. Switch to Full quality for the full resolution.' },
    { q: 'Which is better, Quick or Full quality?', a: 'Quick is nearly instant and gives the camera’s own rendering, at the preview’s size. Full quality gives full resolution but is slower and uses more memory.' },
  ],
});

const cr2 = page({
  path: CR2_JPG,
  slug: 'cr2-to-jpg',
  title: 'CR2 to JPG Converter — Canon RAW, Free',
  h1: 'CR2 to JPG Converter',
  crumb: 'CR2 to JPG',
  from: 'CR2',
  to: 'JPG',
  keyword: 'cr2 to jpg',
  focus: 'raw',
  defaultFormat: 'jpg',
  lead: 'This CR2 to JPG converter turns Canon RAW files into JPGs in your browser, in bulk. Many Canon CR2 files contain a full-size JPEG preview, so conversion can take a fraction of a second per photo — and nothing is uploaded.',
  sections: [
    {
      heading: 'How to convert CR2 to JPG',
      paragraphs: ['Drop your .cr2 files, leave RAW mode on Quick to extract the embedded preview, or choose Full quality to develop the sensor data, then click Convert. With “keep the preview exactly as stored” ticked, the JPEG the camera wrote is passed through untouched, with your chosen metadata options applied.'],
    },
    {
      heading: 'About Canon CR2 files',
      paragraphs: [
        'CR2 is Canon’s second-generation RAW format, used by Canon EOS DSLRs and some other Canon cameras for well over a decade before newer bodies moved to CR3. It is based on the TIFF container, stores the sensor data at 12 or 14 bits per channel with lossless compression, and holds several JPEG images inside: a small thumbnail and a larger preview.',
        'In our tests a Canon EOS 5D Mark IV CR2 of about 34 MB contained a full-size 6720×4480 JPEG preview of roughly 2 MB, so Quick mode gives a full-resolution JPG almost instantly. Canon’s newer CR3 files are also accepted.',
      ],
    },
    {
      heading: 'What is kept and lost converting CR2',
      list: [
        'Kept: the picture at the preview’s or full decode’s resolution, plus camera, lens, date and exposure metadata if you choose.',
        'Lost: 14-bit tonal range, the ability to re-edit exposure and white balance, and Canon’s maker notes.',
        'Not carried over: Dual Pixel RAW data, if the file has it.',
      ],
    },
    EXIF_SECTION,
  ],
  faqs: [
    { q: 'How do I open a CR2 file without Canon software?', a: 'Convert it to JPG here. The converter reads the file in your browser and produces a JPG that any program can open.' },
    { q: 'Is the JPEG preview full size?', a: 'On many Canon bodies it is. The 5D Mark IV file we tested held a full-size 6720×4480 preview. If yours is smaller, use Full quality.' },
    { q: 'Can I convert CR3 files too?', a: 'Yes. Quick mode extracts the JPEG preview from CR3 files, and Full quality uses LibRaw’s CR3 support.' },
  ],
});

const nef = page({
  path: NEF_JPG,
  slug: 'nef-to-jpg',
  title: 'NEF to JPG Converter — Nikon RAW, Free',
  h1: 'NEF to JPG Converter',
  crumb: 'NEF to JPG',
  from: 'NEF',
  to: 'JPG',
  keyword: 'nef to jpg',
  focus: 'raw',
  defaultFormat: 'jpg',
  lead: 'This NEF to JPG converter turns Nikon RAW files into JPGs in your browser, one at a time or in a large batch. Most Nikon NEFs hold a large JPEG preview, so Quick mode is nearly instant — and nothing is uploaded.',
  sections: [
    {
      heading: 'How to convert NEF to JPG',
      paragraphs: ['Drop your .nef files, keep RAW mode on Quick for the embedded preview or switch to Full quality to develop the sensor data, choose the size and metadata options and click Convert. Nikon Coolpix NRW files are accepted too.'],
    },
    {
      heading: 'About Nikon NEF files',
      paragraphs: [
        'NEF, Nikon Electronic Format, is Nikon’s RAW format. Like other RAW formats it is built on TIFF, and depending on the camera and settings it stores 12 or 14 bits per channel, either uncompressed, losslessly compressed or with lossy compression to save space. The file also contains several JPEG images: a thumbnail, a mid-size preview and, on many bodies, a full-size one.',
        'In our tests a Nikon Z 6 NEF of about 26 MB held three JPEGs, at 640×424, 1620×1080 and a full-size 6048×4024, so Quick mode returns the full 24-megapixel picture almost instantly. Older Nikon models may store a smaller largest preview, in which case Full quality gives the full resolution.',
      ],
    },
    {
      heading: 'What is kept and lost converting NEF',
      list: [
        'Kept: camera, lens, date, exposure and orientation metadata, and optionally location.',
        'Lost: the 12- or 14-bit tonal range and the ability to re-edit white balance and exposure.',
        'Not carried over: Nikon’s picture control settings and maker notes.',
      ],
    },
    EXIF_SECTION,
  ],
  faqs: [
    { q: 'How do I convert a Nikon NEF to JPG?', a: 'Drop the NEF file here and click Convert. Quick mode extracts the JPEG preview stored in the file; Full quality develops the RAW data.' },
    { q: 'Why does the JPG look different from Nikon’s software?', a: 'Quick mode returns the JPEG the camera rendered with your picture-control settings. Full quality uses a generic rendering, so it can differ from Nikon’s own software.' },
    { q: 'Does it work for Nikon Z cameras?', a: 'Yes. The Nikon Z 6 file we tested converted through Quick mode at full size.' },
  ],
});

const arw = page({
  path: ARW_JPG,
  slug: 'arw-to-jpg',
  title: 'ARW to JPG Converter — Sony RAW, Free',
  h1: 'ARW to JPG Converter',
  crumb: 'ARW to JPG',
  from: 'ARW',
  to: 'JPG',
  keyword: 'arw to jpg',
  focus: 'raw',
  defaultFormat: 'jpg',
  lead: 'This ARW to JPG converter turns Sony Alpha RAW files into JPGs in your browser. Sony’s embedded preview is often smaller than the full image, so this page offers both a quick preview extraction and a full-resolution decode. Nothing is uploaded.',
  sections: [
    {
      heading: 'How to convert ARW to JPG',
      paragraphs: ['Drop your .arw files. Quick mode extracts the embedded JPEG almost instantly, but for Sony files you will often want Full quality, which develops the sensor data at full resolution. Choose it under RAW files, set the size and metadata options, and click Convert.'],
    },
    {
      heading: 'About Sony ARW files',
      paragraphs: [
        'ARW, Sony Alpha RAW, is the RAW format of Sony’s Alpha mirrorless and DSLR-style cameras. It is TIFF-based and holds the sensor data at 12 or 14 bits per channel; many Sony bodies default to a compressed encoding, and some newer ones also offer lossless compression.',
        'The key thing to know about ARW is the preview. In our test a Sony a7 III ARW of about 26 MB (a 24-megapixel camera) held only a 1616×1080 JPEG preview, so Quick mode gives a picture of under two megapixels. To get the full 6000×4000 resolution, use Full quality. The converter tells you the size of the preview it used on each photo so you can see what you got.',
      ],
    },
    {
      heading: 'What is kept and lost converting ARW',
      list: [
        'Kept: camera, lens, date and exposure metadata, and optionally location.',
        'Lost: 14-bit tonal range and RAW editing headroom.',
        'Different by mode: Quick returns the camera’s own rendering at preview size; Full quality returns full resolution with LibRaw’s rendering.',
      ],
    },
    EXIF_SECTION,
  ],
  faqs: [
    { q: 'Why is my ARW converted image so small?', a: 'Quick mode uses the preview inside the file, and Sony stores a smaller one than the full image. Switch to Full quality for the full resolution.' },
    { q: 'How do I convert ARW to JPG at full size?', a: 'Choose Full quality under RAW files. The sensor data is developed at its full resolution, which is slower and uses more memory than Quick mode.' },
    { q: 'Are Sony SR2 and SRF files supported?', a: 'Yes, they are accepted, with LibRaw’s support in Full quality and the embedded preview in Quick mode.' },
  ],
});

const dng = page({
  path: DNG_JPG,
  slug: 'dng-to-jpg',
  title: 'DNG to JPG Converter — Free, In Your Browser',
  h1: 'DNG to JPG Converter',
  crumb: 'DNG to JPG',
  from: 'DNG',
  to: 'JPG',
  keyword: 'dng to jpg',
  focus: 'raw',
  defaultFormat: 'jpg',
  lead: 'This DNG to JPG converter turns Adobe Digital Negative files, from cameras, drones and phones, into JPGs in your browser. It offers a fast preview extraction and a full-resolution decode, and nothing is uploaded.',
  sections: [
    {
      heading: 'How to convert DNG to JPG',
      paragraphs: ['Drop your .dng files. DNG previews vary a great deal, so check the size shown on each result: if it is smaller than you expect, choose Full quality under RAW files and convert again. Set the output size and metadata options first if you need them.'],
    },
    {
      heading: 'About DNG files',
      paragraphs: [
        'DNG is Adobe’s open RAW format, published as a specification anyone can implement. It is TIFF-based, and unlike camera-specific formats it is used by many different devices: some Leica and Ricoh cameras record it natively, DJI drones write it, and Apple’s ProRAW on iPhones is a DNG variant. Lightroom and Adobe’s DNG Converter also turn other RAW formats into DNG.',
        'Because so many devices write DNGs, they behave very differently. Bit depth ranges from 8 to 16 bits, some files hold mosaic sensor data and others linear, already demosaiced data, and the embedded preview can be almost any size. In our test a Ricoh GR III DNG of about 33 MB contained only a 720×480 preview, so Quick mode would give a small picture; Full quality decodes the actual image.',
      ],
    },
    {
      heading: 'What is kept and lost converting DNG',
      list: [
        'Kept: camera, lens, date and exposure metadata, and optionally location.',
        'Lost: bit depth beyond 8 bits and the editing headroom of the RAW data.',
        'Not carried over: Adobe edit instructions and camera profiles stored in the DNG.',
      ],
    },
    EXIF_SECTION,
  ],
  faqs: [
    { q: 'How do I convert DNG to JPG without Photoshop?', a: 'Drop the DNG file here and click Convert. It runs in your browser and needs no Adobe software.' },
    { q: 'Why does the converted image look small?', a: 'DNG previews can be tiny. Use Full quality to decode the full-resolution image.' },
    { q: 'Does it work with iPhone ProRAW and drone DNGs?', a: 'Full quality uses LibRaw, which supports many DNG variants, but coverage varies between devices; a file that cannot be decoded is reported without stopping the batch.' },
  ],
});

const hub = page({
  path: HUB_PATH,
  slug: 'image-converter',
  title: 'Image Converter — HEIC, RAW, PNG, WebP, JPG',
  h1: 'Image Converter',
  crumb: 'Image Converter',
  from: 'images',
  to: 'JPG, PNG or WebP',
  keyword: 'image converter',
  focus: 'any',
  defaultFormat: 'jpg',
  description: 'Convert HEIC, camera RAW, PNG, WebP, AVIF and JPG in your browser. Batch conversion, EXIF preserved, optional GPS removal. Nothing leaves your device.',
  lead: 'This image converter changes photos between HEIC, camera RAW, JPG, PNG, WebP and AVIF in your browser, in batches, with control over quality, size and whether location data is kept. Your images are never uploaded.',
  sections: [
    {
      heading: 'Image converter for HEIC, RAW, PNG, WebP and JPG',
      paragraphs: ['Drop any mix of photos, choose JPEG, PNG or WebP as the output, and convert. HEIC files are decoded with libheif, camera RAW files with an embedded-preview shortcut or a full LibRaw decode, and JPG, PNG, WebP, AVIF, GIF and BMP files with your browser’s own decoder. Everything is re-encoded with WebAssembly builds of MozJPEG, OxiPNG and libwebp for better quality than a browser’s default encoder.'],
    },
    {
      heading: 'Choosing an output format',
      list: [
        'JPEG: the safe choice for photographs; works everywhere and is small. Keeps the metadata.',
        'PNG: lossless, best for screenshots, graphics and text; large for photographs.',
        'WebP: smaller than JPEG at similar quality and supported by all modern browsers; ideal for websites.',
      ],
    },
    {
      heading: 'Resizing and quality',
      paragraphs: ['Set the longest side to shrink photos for email or the web; the aspect ratio is kept and the picture is resampled with high-quality smoothing. The quality slider applies to JPEG and WebP: 90 is visually close to the original for most photos, and 75–80 saves a lot of space with little visible change.'],
    },
    COLOUR_SECTION,
    EXIF_SECTION,
  ],
  faqs: [
    { q: 'Which image formats can I convert?', a: 'Input: HEIC and HEIF, camera RAW (CR2, CR3, NEF, ARW, DNG and more), JPG, PNG, WebP, AVIF, GIF and BMP. Output: JPEG, PNG and WebP.' },
    { q: 'Which format should I choose for a website?', a: 'WebP is usually the smallest at the same visual quality and works in every modern browser. Use JPEG if you need the widest compatibility and to keep metadata.' },
    GPS_FAQ,
  ],
});

export const IMAGE_PAGES = [hub, heicToJpg, heicNoUpload, heicToPng, rawToJpg, cr2, nef, arw, dng];
