# Chrome-Plugin-submit-doc-with-prompt
This is an unpacked Cherome plugin that injects buttons and input fields into a https://chat.openai.com/ web page that:
1. Allows the selection of a file, text (.txt, .md), MS Word files (.doc, .docx) and .pdf files.
2. Extracts the text from the selected file and breaks it into chunks, based on a chosen "textChunkSizeLimit" (default=15,000). The chunks are truncated at the last paragraph prior to the textChunkSizeLimit.
3. Allows for the input of a prompt that will be submitted to chatGPT with each textChunk

It uses the docsToText.js library to extract the text, see https://github.com/bshopcho/docsToText. This library should be in the root folder of the plugin.

![2023-05-28 16_02_12-https___chat openai com__model=text-davinci-002-render-sha - Vivaldi](https://github.com/BigGHS/Chrome-Plugin-submit-doc-with-prompt/assets/61913681/82baa1d8-b9e1-41ae-951c-920f9eb972e1)
