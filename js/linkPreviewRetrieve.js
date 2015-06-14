/**
 * Copyright (c) 2014 Leonardo Cardoso (http://leocardz.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.0
 */
(function ($) {
    $.fn.linkPreviewRetrieve = function (options) {

        var selector = $(this);

        $.get('php/retrieve.php', {}, function (answer) {
            for (var i = 0; i < answer.length; i++) {
                var item = answer[i];

                var contentImage = '';
                var previewContentPostWidth = 'style="width: 500px;"';
                if (item.image !== '') {
                    contentImage = '<div class="previewImagesPosted"><div class="previewImagePosted"><a href="' + item.url + '" target="_blank"><img src="' + item.image + '" style="width: 130px; height: auto; float: left;"></a></div></div>';
                    previewContentPostWidth = '';
                }

                if (item.iframe != "") {
                    iframeId = item.iframe.split("id=\"");
                    iframeId = iframeId[1].split("\"");
                    iframeId = iframeId[0];

                    selector.append('<div class="previewPosted" id="contentWrap' + item.id + '" style=""><div class="previewTextPosted"> ' + item.text + ' </div> ' + item.iframe + ' <div class="previewImagesPosted"><div class="previewImagePosted"><img id="img_' + iframeId + '" src="' + item.image + '" class="imgIframe" style="width: 130px; height: auto; float: left;"><span class="videoPostPlay"  id="videoPostPlay'+ iframeId+'"></span></div></div><div class="previewContentPosted"><div class="previewTitlePosted" id="pTP_' + iframeId + '" style="width: 355px">' + item.title + '</div><div class="previewUrlPosted">' + item.canonicalUrl + '</div><div class="previewDescriptionPosted" id="pDP_' + iframeId + '" style="width: 355px"> <span id="previewSpanDescription">' + item.description + '</textarea></div></div><div style="clear: both"><span style="color: red; cursor: pointer; float: right" id="delete_action_' + item.id + '" ref="' + item.id + '">delete</span></div></div>');

                    $(".imgIframe").unbind('click').click(function (e) {
                        e.stopPropagation();
                        iframenize($(this));
                    });
                    $('#videoPostPlay'+ iframeId).click(function (e) {
                        e.stopPropagation();
                        iframenize($(this).parent().find(".imgIframe"));
                    });
                }
                else {
                    selector.append('<div class="previewPosted" id="contentWrap' + item.id + '" style=""><div class="previewTextPosted"> ' + item.text + '  </div>' + contentImage + '<div class="previewContentPosted" ' + previewContentPostWidth + '><div class="previewTitlePosted" ><a href="' + item.url + '" target="_blank"><span id="previewSpanTitle">' + item.title + '</span></a></div><div class="previewUrlPosted">' + item.canonicalUrl + '</div><div class="previewDescriptionPosted"  > <span id="previewSpanDescription">' + item.description + '</span></div><div style="clear: both"><span style="color: red; cursor: pointer; float: right" id="delete_action_' + item.id + '" ref="' + item.id + '">delete</span></div></div>');
                }

                $("#delete_action_" + item.id).click(function () {
                    var id = $(this).attr("ref");
                    $.post('php/delete.php', {id: id}, function (answer) {
                        if(answer !== "") console.log(answer);
                        $("#contentWrap" + id).remove();
                    });
                });
            }
        }, 'json');

        function iframenize(obj) {

            var oldId = obj.attr("id");
            var currentId = oldId.substring(4);
            pTP = "pTP_" + currentId;
            pDP = "pDP_" + currentId;
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

    };
})(jQuery);
