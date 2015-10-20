/**
 * Copyright (c) 2014 Leonardo Cardoso (http://leocardz.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.0
 */
(function ($) {
    $.fn.linkPreview = function (options) {

        var defaults = {
            placeholder: "What's in your mind",
            imageQuantity: -1 // illimited
        };

        var opts = jQuery.extend(defaults, options);

        function trim(str) {
            return str.replace(/^\s+|\s+$/g, "");
        }

        var selector = $(this).selector;
        selector = selector.substr(1);

        $(this).append('<div id="previewLoading_' + selector + '" class="previewLoading"></div> <div style="float: left;"> <textarea type="text" id="text_' + selector + '" style="text-align: left" placeholder="' + opts.placeholder + '" class="text" style="text-align: left"/></textarea> <div style="clear: both"></div> </div> <div id="preview_' + selector + '" class="preview"> <div id="previewImages_' + selector + '" class="previewImages"> <div id="previewImage_' + selector + '" class="previewImage"><img src="img/loader.gif" style="margin-left: 43%; margin-top: 39%;"/> </div> <input type="hidden" id="photoNumber_' + selector + '" class="photoNumber" value="0" /> </div> <div id="previewContent_' + selector + '" class="previewContent"> <div id="closePreview_' + selector + '" title="Remove" class="closePreview" ></div> <div id="previewTitle_' + selector + '" class="previewTitle"></div> <div id="previewUrl_' + selector + '" class="previewUrl"></div> <div id="previewDescription_' + selector + '" class="previewDescription"></div> <div id="hiddenDescription_' + selector + '" class="hiddenDescription"></div> <div id="previewButtons_' + selector + '" class="previewButtons" > <div id="previewPreviousImg_' + selector + '" class="buttonLeftDeactive" ></div> <div id="previewNextImg_' + selector + '" class="buttonRightDeactive" ></div> <div id="photoNumbers_' + selector + '" class="photoNumbers" ></div> <div id="chooseThumbnail_' + selector + '" class="chooseThumbnail"> Choose a thumbnail </div> </div> <div class="nT" id="nT_' + selector + '" > <span id="noThumbDiv_' + selector + '" class="noThumbDiv" ><input type="checkbox" id="noThumb_' + selector + '" class="noThumb noThumbCb" />  No thumbnail</span> </div> </div> <div style="clear: both"></div> </div> <div style="clear: both"></div> <div id="postPreview_' + selector + '" class="postPreview"> <input id="postPreviewButton_' + selector + '" class="postPreviewButton" type="submit" value="Post" /> <div style="clear: both"></div> </div> <div class="previewPostedList" id="previewPostedList_' + selector + '"></div>');

        var text;
        var urlRegex = /(https?\:\/\/|\s)[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})(\/+[a-z0-9_.\:\;-]*)*(\?[\&\%\|\+a-z0-9_=,\.\:\;-]*)?([\&\%\|\+&a-z0-9_=,\:\;\.-]*)([\!\#\/\&\%\|\+a-z0-9_=,\:\;\.-]*)}*/i;
        var block = false;
        var blockTitle = false;
        var blockDescription = false;
        var contentWidth = 355;
        var content = "";
        var image = "";
        var images = "";
        var title = "";
        var url = "";
        var video = "no";
        var videoPlay = "";
        var description = "";
        var hrefUrl = "";
        var videoIframe = "";
        var leftSideContent = "";
        var photoNumber = 0;
        var firstPosted = false;
        var firstPosting = false;
        var nT = false;
        var imageId = "";
        var imageIdArray = "";
        var pTP = "";
        var pDP = "";
        var fancyUrl = '';
        var allowPosting = false;
        var isCrawling = false;
        var defaultTitle = "Enter a title";
        var defaultDescription = "Enter a description";

        var textText = "";
        $('#text_' + selector).focus(function () {
            if (trim($('#text_' + selector).val()) === textText) {
                $(this).val('');
                $(this).css({
                    'color': 'black'
                });
            }
        }).blur(function () {
            if (trim($('#text_' + selector).val()) === "") {
                $(this).val(textText);
                $(this).css({
                    'color': 'grey'
                });
            }
        });

        function resetPreview() {
            $('#previewPreviousImg_' + selector).removeClass('buttonLeftActive');
            $('#previewPreviousImg_' + selector).addClass('buttonLeftDeactive');
            $('#previewNextImg_' + selector).removeClass('buttonRightActive');
            $('#previewNextImg_' + selector).addClass('buttonRightDeactive');
            $('#previewButtons_' + selector).show();
            contentWidth = 355;
            photoNumber = 0;
            $('#previewContent_' + selector).css({
                'width': '355px'
            });
            $('#noThumb_' + selector).show();
            $('#nT_' + selector).show();
            $('#noThumb_' + selector).removeAttr('checked');
            images = "";
        }


        function noThumbAction(inputCheckbox, src) {

            var value = src === 'parent' ? !inputCheckbox.prop("checked") : inputCheckbox.prop("checked");

            inputCheckbox.prop('checked', value);

            $('#imagePreview_' + selector + '_' + photoNumber).css({
                'display': !value ? 'block' : 'none'
            });
            $('#whiteImage_' + selector).css({
                'display': !value ? 'none' : 'block'
            });
            $('#previewContent_' + selector).css({
                'width': !value ? '355px' : '500px'
            });

            if (value === true) {
                $('#previewButtons_' + selector).hide();
            } else {
                $('#previewButtons_' + selector).show();

            }

        }

        function iframenize(obj) {

            var oldId = obj.prop("id");
            var currentId = oldId.substring(3);
            pTP = "pTP" + currentId;
            pDP = "pDP" + currentId;
            oldId = "#" + oldId;
            currentId = "#" + currentId;
            $(oldId).css({
                'display': 'none'
            });
            $(currentId).css({
                'display': 'block'
            });
            $('#' + pTP).css({
                'width': '495px'
            });
            $('#' + pDP).css({
                'width': '495px'
            });

        }


        var crawlText = function () {

            allowPosting = true;
            block = false;
            hrefUrl = '';
            fancyUrl = '';
            images = '';
            video = '';

            text = " " + $('#text_' + selector).val();
            if (trim(text) !== "") {
                video = "no";
                videoPlay = "";
                if (block === false && urlRegex.test(text)) {
                    block = true;
                    $('#preview_' + selector).hide();
                    $('#previewButtons_' + selector).hide();
                    $('#previewLoading_' + selector).html("<img src='img/loader.gif' />");
                    $('#photoNumber_' + selector).val(0);

                    allowPosting = false;
                    isCrawling = true;

                    $.post('php/textCrawler.php', {
                        text: text,
                        imagequantity: opts.imageQuantity
                    }, function (answer) {

                        if (answer.url === null)
                            answer.url = "";
                        if (answer.pageUrl === null)
                            answer.pageUrl = "";
                        if (answer.title === null || answer.title === "")
                            answer.title = defaultTitle;
                        if (answer.description === null || answer.description === "")
                            answer.description = defaultDescription;
                        if (answer.canonicalUrl === null)
                            answer.canonicalUrl = "";
                        if (answer.images === null)
                            answer.images = "";
                        if (answer.video === null)
                            answer.video = "";
                        if (answer.videoIframe === null)
                            answer.videoIframe = "";
                        resetPreview();
                        $('#previewLoading_' + selector).html("");
                        $('#preview_' + selector).show();
                        $('#previewTitle_' + selector).html("<span id='previewSpanTitle_" + selector + "' class='previewSpanTitle' >" + answer.title + "</span><input type='text' value='" + answer.title + "' id='previewInputTitle_" + selector + "' class='previewInputTitle inputPreview' style='display: none;'/>");
                        $('#text_' + selector).css({
                            "border": "1px solid #b3b3b3",
                            "border-bottom": "1px dashed #b3b3b3"
                        });

                        $('#previewUrl_' + selector).html(answer.url);
                        $('#previewDescription_' + selector).html("<span id='previewSpanDescription_" + selector + "' class='previewSpanDescription' >" + answer.description + "</span><textarea id='previewInputDescription_" + selector + "' class='previewInputDescription' style='display: none;' class='inputPreview' >" + answer.description + "</textarea>");
                        title = "<a href='" + answer.pageUrl + "' target='_blank'>" + $('#previewTitle_' + selector).html() + "</a>";
                        url = "<a href='http://" + answer.canonicalUrl + "' target='_blank'>" + answer.canonicalUrl + "</a>";
                        fancyUrl = answer.canonicalUrl;
                        hrefUrl = answer.url;
                        description = $('#previewDescription_' + selector).html();
                        video = answer.video;
                        videoIframe = answer.videoIframe;
                        try {
                            images = (answer.images).split("|");
                            $('#previewImages_' + selector).show();
                            $('#previewButtons_' + selector).show();
                        } catch (err) {
                            $('#previewImages_' + selector).hide();
                            $('#previewButtons_' + selector).hide();
                        }
                        images.length = parseInt(images.length);
                        var appendImage = "";
                        for (i = 0; i < images.length; i++) {
                            if (i === 0)
                                appendImage += "<img id='imagePreview_" + selector + "_" + i + "' src='" + images[i] + "' style='width: 130px; height: auto' ></img>";
                            else
                                appendImage += "<img id='imagePreview_" + selector + "_" + i + "' src='" + images[i] + "' style='width: 130px; height: auto; display: none' ></img>";
                        }
                        $('#previewImage_' + selector).html("<a href='" + answer.pageUrl + "' target='_blank'>" + appendImage + "</a><div id='whiteImage' style='width: 130px; color: transparent; display:none;'>...</div>");
                        $('#photoNumbers_' + selector).html("1 of " + images.length);
                        if (images.length > 1) {
                            $('#previewNextImg_' + selector).removeClass('buttonRightDeactive');
                            $('#previewNextImg_' + selector).addClass('buttonRightActive');

                            if (firstPosted === false) {
                                firstPosted = true;
                                $('#previewPreviousImg_' + selector).unbind('click').click(function (e) {
                                    e.stopPropagation();
                                    if (images.length > 1) {
                                        photoNumber = parseInt($('#photoNumber_' + selector).val());
                                        $('#imagePreview_' + selector + '_' + photoNumber).css({
                                            'display': 'none'
                                        });
                                        photoNumber -= 1;
                                        if (photoNumber === -1)
                                            photoNumber = 0;
                                        $('#previewNextImg_' + selector).removeClass('buttonRightDeactive');
                                        $('#previewNextImg_' + selector).addClass('buttonRightActive');
                                        if (photoNumber === 0) {
                                            photoNumber = 0;
                                            $('#previewPreviousImg_' + selector).removeClass('buttonLeftActive');
                                            $('#previewPreviousImg_' + selector).addClass('buttonLeftDeactive');
                                        }
                                        $('#imagePreview_' + selector + '_' + photoNumber).css({
                                            'display': 'block'
                                        });
                                        $('#photoNumber_' + selector).val(photoNumber);
                                        $('#photoNumbers_' + selector).html(parseInt(photoNumber + 1) + " of " + images.length);
                                    }
                                });
                                $('#previewNextImg_' + selector).unbind('click').click(function (e) {
                                    e.stopPropagation();
                                    if (images.length > 1) {
                                        photoNumber = parseInt($('#photoNumber_' + selector).val());
                                        $('#imagePreview_' + selector + '_' + photoNumber).css({
                                            'display': 'none'
                                        });
                                        photoNumber += 1;
                                        if (photoNumber === images.length)
                                            photoNumber = images.length - 1;
                                        $('#previewPreviousImg_' + selector).removeClass('buttonLeftDeactive');
                                        $('#previewPreviousImg_' + selector).addClass('buttonLeftActive');
                                        if (photoNumber === images.length - 1) {
                                            photoNumber = images.length - 1;
                                            $('#previewNextImg_' + selector).removeClass('buttonRightActive');
                                            $('#previewNextImg_' + selector).addClass('buttonRightDeactive');
                                        }
                                        $('#imagePreview_' + selector + '_' + photoNumber).css({
                                            'display': 'block'
                                        });
                                        $('#photoNumber_' + selector).val(photoNumber);
                                        $('#photoNumbers_' + selector).html(parseInt(photoNumber + 1) + " of " + images.length);
                                    }
                                });
                            }
                        } else if (images.length === 0) {
                            $('#closePreview_' + selector).css({
                                "margin-right": "-206px"
                            });
                            $('#previewTitle_' + selector).css({
                                "width": "495px"
                            });
                            $('#previewDescription_' + selector).css({
                                "width": "495px"
                            });
                            $('#previewInputDescription_' + selector).css({
                                "width": "495px"
                            });
                            contentWidth = 495;
                            $('#previewButtons_' + selector).hide();
                            $('#noThumb_' + selector).hide();
                            $('#nT_' + selector).hide();
                        }
                        $('#nT_' + selector).unbind('click').click(function (e) {
                            e.stopPropagation();
                            noThumbAction($('#noThumb_' + selector), 'parent');
                        });
                        $('#noThumb_' + selector).unbind('click').click(function (e) {
                            e.stopPropagation();
                            noThumbAction($(this), 'input');
                        });
                        $('#previewSpanTitle_' + selector).unbind('click').click(function (e) {
                            e.stopPropagation();
                            if (blockTitle === false) {
                                blockTitle = true;
                                $('#previewSpanTitle_' + selector).hide();
                                $('#previewInputTitle_' + selector).show();
                                $('#previewInputTitle_' + selector).val($('#previewInputTitle_' + selector).val());
                                $('#previewInputTitle_' + selector).focus().select();
                            }
                        });
                        $('#previewInputTitle_' + selector).blur(function () {
                            blockTitle = false;
                            $('#previewSpanTitle_' + selector).html($('#previewInputTitle_' + selector).val());
                            $('#previewSpanTitle_' + selector).show();
                            $('#previewInputTitle_' + selector).hide();
                        });
                        $('#previewInputTitle_' + selector).keypress(function (e) {
                            if (e.which === 13) {
                                blockTitle = false;
                                $('#previewSpanTitle_' + selector).html($('#previewInputTitle_' + selector).val());
                                $('#previewSpanTitle_' + selector).show();
                                $('#previewInputTitle_' + selector).hide();
                            }
                        });
                        $('#previewSpanDescription_' + selector).unbind('click').click(function (e) {
                            e.stopPropagation();
                            if (blockDescription === false) {
                                blockDescription = true;
                                $('#previewSpanDescription_' + selector).hide();
                                $('#previewInputDescription_' + selector).show();
                                $('#previewInputDescription_' + selector).val($('#previewInputDescription_' + selector).val());
                                $('#previewInputDescription_' + selector).focus().select();
                            }
                        });
                        $('#previewInputDescription_' + selector).blur(function () {
                            blockDescription = false;
                            $('#previewSpanDescription_' + selector).html($('#previewInputDescription_' + selector).val());
                            $('#previewSpanDescription_' + selector).show();
                            $('#previewInputDescription_' + selector).hide();
                        });
                        $('#previewInputDescription_' + selector).keypress(function (e) {
                            if (e.which === 13) {
                                blockDescription = false;
                                $('#previewSpanDescription_' + selector).html($('#previewInputDescription_' + selector).val());
                                $('#previewSpanDescription_' + selector).show();
                                $('#previewInputDescription_' + selector).hide();
                            }
                        });
                        $('#previewSpanTitle_' + selector).mouseover(function () {
                            $('#previewSpanTitle_' + selector).css({
                                "background-color": "#ff9"
                            });
                        });
                        $('#previewSpanTitle_' + selector).mouseout(function () {
                            $('#previewSpanTitle_' + selector).css({
                                "background-color": "transparent"
                            });
                        });
                        $('#previewSpanDescription_' + selector).mouseover(function () {
                            $('#previewSpanDescription_' + selector).css({
                                "background-color": "#ff9"
                            });
                        });
                        $('#previewSpanDescription_' + selector).mouseout(function () {
                            $('#previewSpanDescription_' + selector).css({
                                "background-color": "transparent"
                            });
                        });
                        $('#closePreview_' + selector).unbind('click').click(function (e) {
                            e.stopPropagation();
                            block = false;
                            hrefUrl = '';
                            fancyUrl = '';
                            images = '';
                            video = '';
                            $('#preview_' + selector).fadeOut("fast", function () {
                                $('#text_' + selector).css({
                                    "border": "1px solid #b3b3b3",
                                    "border-bottom": "1px solid #e6e6e6"
                                });
                                $('#previewImage_' + selector).html("");
                                $('#previewTitle_' + selector).html("");
                                $('#previewUrl_' + selector).html("");
                                $('#previewDescription_' + selector).html("");
                            });

                        });
                        if (firstPosting === false) {
                            firstPosting = true;
                        }
                        allowPosting = true;
                        isCrawling = false;
                    }, "json");
                }
            }
        };

        $('#text_' + selector).bind({
            paste: function () {
                setTimeout(function () {
                    crawlText();
                }, 100);
            },
            keyup: function (e) {
                if ((e.which === 13 || e.which === 32 || e.which === 17)) {
                    crawlText();
                }
            }
        });


        $('#postPreviewButton_' + selector).unbind('click').click(function (e) {
            e.stopPropagation();

            imageId = "";
            pTP = "";
            pDP = "";
            text = " " + $('#text_' + selector).val();
            title = $('#previewTitle_' + selector).html();
            description = $('#previewDescription_' + selector).html();

            if (((trim(text) !== "") || (trim(text) === "" && trim(hrefUrl) !== "")) && (allowPosting === true && isCrawling === false)) {
                $.get('php/highlightUrls.php', {
                    text: text,
                    description: description
                }, function (urls) {

                    if ($('#noThumb_' + selector).prop('checked') || images.length === 0) {
                        contentWidth = 495;
                        leftSideContent = "";
                    } else if (images || video) {
                        if (video === "yes") {
                            var pattern = /id="(.+?)"/i;
                            imageIdArray = videoIframe.match(pattern);
                            imageId = imageIdArray[1];
                            pTP = "pTP" + imageId;
                            pDP = "pDP" + imageId;
                            var imageIdPrefixed = "img" + imageId;
                            image = "<img id='" + imageIdPrefixed + "' src='" + $('#imagePreview_' + selector + '_' + photoNumber).prop("src") + "' class='imgIframe' style='width: 130px; height: auto; float: left;' ></img>";
                            videoPlay = '<span class="videoPostPlay" id="videoPostPlay' + imageId + '"></span>';
                            leftSideContent = image + videoPlay;
                        } else {
                            image = "<img src='" + $('#imagePreview_' + selector + '_' + photoNumber).prop("src") + "' style='width: 130px; height: auto; float: left;' ></img>";
                            leftSideContent = '<a href="' + hrefUrl + '" target="_blank">' + image + '</a>';
                        }
                    }

                    if (title.indexOf(defaultTitle) != -1) {
                        title = title.replace(defaultTitle, "");
                    }

                    if (urls.description.indexOf(defaultDescription) != -1) {
                        urls.description = replaceAll(defaultDescription, '', urls.description);
                    }


                    /** Database insert */
                    $.post('php/save.php', {
                        text: $('#text_' + selector).val(),
                        image: $('#noThumb_' + selector).prop("checked") ? '' : $('#imagePreview_' + selector + '_' + photoNumber).prop("src"),
                        title: title,
                        canonicalUrl: fancyUrl,
                        url: hrefUrl,
                        description: $('#previewSpanDescription_' + selector).html(),
                        iframe: videoIframe
                    }, function (response) {

                        // console.log(response);

                        var id = !isNaN(response) ? response : Math.floor((Math.random() * 1000000000) + 1);

                        content = '<div class="previewPosted" id="contentWrap' + id + '" >' + '<div class="previewTextPosted">' + urls.urls + '</div>' + videoIframe + '<div class="previewImagesPosted">' + '<div class="previewImagePosted">' + leftSideContent + '</div>' + '</div>' + '<div class="previewContentPosted">' + '<div class="previewTitlePosted" id="' + pTP + '" style="width: ' + contentWidth + 'px" ><a href="' + hrefUrl + '" target="_blank">' + title + '</a></div>' + '<div class="previewUrlPosted">' + fancyUrl + '</div>' + '<div class="previewDescriptionPosted" id="' + pDP + '" style="width: ' + contentWidth + 'px" >' + urls.description + '</div>' + '</div><div style="clear: both"><span style="color: red; cursor: pointer; float: right" id="delete_action_' + id + '" ref="' + id + '">delete</span></div></div>';

                        $('#preview_' + selector).fadeOut("fast", function () {

                            // Vine video needs to be preloaded
                            if (hrefUrl.indexOf("vine.co") != -1) {
                                setTimeout(function () {
                                    $('#' + imageId).hide();
                                }, 50);

                            }

                            $('#text_' + selector).css({
                                "border": "1px solid #b3b3b3",
                                "border-bottom": "1px solid #e6e6e6"
                            });
                            $('#text_' + selector).val("");
                            hrefUrl = "";
                            $('#previewImage_' + selector).html("");
                            $('#previewTitle_' + selector).html("");
                            $('#previewUrl_' + selector).html("");
                            $('#previewDescription_' + selector).html("");
                            $(content).hide().prependTo('#previewPostedList_' + selector).fadeIn("fast");
                            $(".imgIframe").unbind('click').click(function (e) {
                                e.stopPropagation();
                                iframenize($(this));
                            });
                            $('#videoPostPlay' + imageId).click(function (e) {
                                e.stopPropagation();
                                iframenize($(this).parent().find(".imgIframe"));
                            });

                            $("#delete_action_" + id).click(function () {
                                var id = $(this).attr("ref");
                                $.post('php/delete.php', {id: id}, function (answer) {
                                    // console.log(answer);
                                    $("#contentWrap" + id).remove();
                                });
                            });


                        });

                    });

                }, "json");
                text = "";
            }
        });

        function replaceAll(find, replace, str) {
            return str.replace(new RegExp(find, 'g'), replace);
        }

    };

})(jQuery);
