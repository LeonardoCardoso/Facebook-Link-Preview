Facebook-Like Link Preview
==========================

The algorithm keeps tracking what you are typing in the status field and through regular expressions identifies a url. Thereafter, the text is in the field is passed to PHP that does all the work to analyze all the source code of the url found. If you enter more than one url, it will consider that the first one is the more relevant and it will create a preview.
Once the source code of the url is obtained, regular expressions begin to seek out and capture relevant informations on it. These informations is basically the title page, the images contained therein, and a brief description of the content covered in the page.

For more details, visit http://lab.leocardz.com/facebook-link-preview-php--jquery/

![Link Preview](http://leocardz.com/util/assets/images/posts/facebook-link-preview-php--jquery/linkPreviewImageTimeLapse.png)