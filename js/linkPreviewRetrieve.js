/**
 * Copyright (c) 2014 Leonardo Cardoso (http://leocardz.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.0
 */
(function($) {
    $.fn.linkPreviewRetrieve = function(options) {

        var selector = $(this);

        $.get('php/retrieve.php', {}, function(answer) {
            for(var i =0; i < answer.length; i++){
                var item = answer[i];

                if(item.iframe != ""){
                    iframeId = item.iframe.split("id=\"");
                    iframeId = iframeId[1].split("\"");
                    iframeId = iframeId[0];

                    selector.append('<div class="previewPosted" style=""><div class="previewTextPosted"> '+item.text+' </div> '+item.iframe+' <div class="previewImagesPosted"><div class="previewImagePosted"><img id="img_'+iframeId+'" src="'+item.image+'" class="imgIframe" style="width: 130px; height: auto; float: left;"><span class="videoPostPlay"></span></div></div><div class="previewContentPosted"><div class="previewTitlePosted" id="pTP_'+iframeId+'" style="width: 355px">'+item.title+'</div><div class="previewUrlPosted">'+item.canonicalUrl+'</div><div class="previewDescriptionPosted" id="pDP_'+iframeId+'" style="width: 355px"> <span id="previewSpanDescription">'+item.description+'</textarea></div></div><div style="clear: both"></div></div>');

                    $(".imgIframe").click(function() {
                        var oldId = $(this).attr("id");
                        var currentId = oldId.substring(4);
                        pTP = "pTP_" + currentId;
                        pDP = "pDP_" + currentId;
                        oldId = "#" + oldId;
                        currentId = "#" + currentId;
                        $(oldId).css({
                            'display' : 'none'
                        });
                        $(currentId).css({
                            'display' : 'block'
                        });
                        $('#' + pTP).css({
                            'width' : '495px'
                        });
                        $('#' + pDP).css({
                            'width' : '495px'
                        });
                    });

                }
                else
                    selector.append('<div class="previewPosted" style=""><div class="previewTextPosted"> '+item.text+'  </div><div class="previewImagesPosted"><div class="previewImagePosted"><a href="'+item.url+'" target="_blank"><img src="'+item.image+'" style="width: 130px; height: auto; float: left;"></a></div></div><div class="previewContentPosted"><div class="previewTitlePosted" ><a href="'+item.url+'" target="_blank"><span id="previewSpanTitle">'+item.title+'</span></a></div><div class="previewUrlPosted">'+item.canonicalUrl+'</div><div class="previewDescriptionPosted"  > <span id="previewSpanDescription">'+item.description+'</span></div><div style="clear: both"></div></div>');
         }
        }, 'json');

    };
})(jQuery);
