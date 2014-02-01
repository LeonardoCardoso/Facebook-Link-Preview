/**
 * Copyright (c) 2012 Leonardo Cardoso (http://leocardz.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.0.0
 *
 */
(function($) {
	$.fn.linkPreview = function(options) {
        function trim(str) {
            return str.replace(/^\s+|\s+$/g, "");
        }

		var defaults = {
			imageQuantity : -1 // illimited
		};
		var opts = jQuery.extend(defaults, options);

		var text;
		var urlRegex = /(https?\:\/\/|\s)[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})(\/+[a-z0-9_.\:\;-]*)*(\?[\&\%\|\+a-z0-9_=,\.\:\;-]*)?([\&\%\|\+&a-z0-9_=,\:\;\.-]*)([\!\#\/\&\%\|\+a-z0-9_=,\:\;\.-]*)}*/i;
		var block = false;
		var blockTitle = false;
		var blockDescription = false;
		var contentWidth = 290;
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
		var pTP = "";
		var pDP = "";
		var fancyUrl = '';
		var allowPosting = false;
		var isCrawling = false;

		var textText = "";
		$('#text').focus(function() {
			if (trim($('#text').val()) === textText) {
				$(this).val('');
				$(this).css({
					'color' : 'black'
				});
			}
		});
		$('#text').blur(function() {
			if (trim($('#text').val()) === "") {
				$(this).val(textText);
				$(this).css({
					'color' : 'grey'
				});
			}
		});

		function resetPreview() {
			$('#previewPreviousImg').removeClass('buttonLeftActive');
			$('#previewPreviousImg').addClass('buttonLeftDeactive');
			$('#previewNextImg').removeClass('buttonRightActive');
			$('#previewNextImg').addClass('buttonRightDeactive');
			$('#closePreview').css({
				"margin-right" : "-66px"
			});
			$('#previewTitle').css({
				"width" : "290px"
			});
			$('#previewDescription').css({
				"width" : "290px"
			});
			$('#previewButtons').show();
			contentWidth = 290;
			photoNumber = 0;
			$('#noThumb').show();
			$('.nT').show();
			$('#noThumb').removeAttr("checked");
			images = "";
		}


		$('#text').keyup(function(e) {

			allowPosting = true;

			if ((e.which === 13 || e.which === 32 || e.which === 17) && trim($(this).val()) !== "") {
				text = " " + $('#text').val();
				video = "no";
				videoPlay = "";
				if (block === false && urlRegex.test(text)) {
					block = true;
					$('#preview').hide();
					$('#previewButtons').hide();
					$('#previewLoading').html("<img src='img/loader.gif' />");
					$('#photoNumber').val(0);

					allowPosting = false;
					isCrawling = true;

					$.get('php/textCrawler.php', {
						text : text,
						imagequantity : opts.imageQuantity
					}, function(answer) {
						if (answer.url === null)
							answer.url = "";
						if (answer.pageUrl === null)
							answer.pageUrl = "";
						if (answer.title === null)
							answer.title = answer.titleEsc;
						if (answer.description === null)
							answer.description = answer.descriptionEsc;
						if (answer.title === null || answer.title === "")
							answer.title = "Enter a title";
						if (answer.description === null || answer.description === "")
							answer.description = "Enter a description";
						if (answer.canonicalUrl === null)
							answer.canonicalUrl = "";
						if (answer.images === null)
							answer.images = "";
						if (answer.video === null)
							answer.video = "";
						if (answer.videoIframe === null)
							answer.videoIframe = "";
						resetPreview();
						$('#previewLoading').html("");
						$('#preview').show();
						$('#previewTitle').html("<span id='previewSpanTitle' >" + answer.title + "</span><input type='text' value='" + answer.title + "' id='previewInputTitle' class='inputPreview' style='display: none;'/>");
						$('#text').css({
							"border" : "1px solid #b3b3b3",
							"border-bottom" : "1px dashed #b3b3b3"
						});

						$('#previewUrl').html(answer.url);
						$('#previewDescription').html("<span id='previewSpanDescription' >" + answer.description + "</span><textarea id='previewInputDescription' style='width: 290px; display: none;' class='inputPreview' >" + answer.description + "</textarea>");
						title = "<a href='" + answer.pageUrl + "' target='_blank'>" + $('#previewTitle').html() + "</a>";
						url = "<a href='http://" + answer.canonicalUrl + "' target='_blank'>" + answer.canonicalUrl + "</a>";
						fancyUrl = answer.canonicalUrl;
						hrefUrl = answer.url;
						description = $('#previewDescription').html();
						video = answer.video;
						videoIframe = answer.videoIframe;
						try {
							images = (answer.images).split("|");
							$('#previewImages').show();
							$('#previewButtons').show();
						} catch (err) {
							$('#previewImages').hide();
							$('#previewButtons').hide();
						}
						images.length = parseInt(images.length);
						var appendImage = "";
						for ( i = 0; i < images.length; i++) {
							if (i === 0)
								appendImage += "<img id='imagePreview" + i + "' src='" + images[i] + "' style='width: 130px; height: auto' ></img>";
							else
								appendImage += "<img id='imagePreview" + i + "' src='" + images[i] + "' style='width: 130px; height: auto; display: none' ></img>";
						}
						$('#previewImage').html("<a href='" + answer.pageUrl + "' target='_blank'>" + appendImage + "</a><div id='whiteImage' style='width: 130px; color: transparent; display:none;'>...</div>");
						$('.photoNumbers').html("1 of " + images.length);
						if (images.length > 1) {
							$('#previewNextImg').removeClass('buttonRightDeactive');
							$('#previewNextImg').addClass('buttonRightActive');

							if (firstPosted === false) {
								firstPosted = true;
								$('#previewPreviousImg').click(function() {
									if (images.length > 1) {
										photoNumber = parseInt($('#photoNumber').val());
										$('#imagePreview' + photoNumber).css({
											'display' : 'none'
										});
										photoNumber -= 1;
										if (photoNumber === -1)
											photoNumber = 0;
										$('#previewNextImg').removeClass('buttonRightDeactive');
										$('#previewNextImg').addClass('buttonRightActive');
										if (photoNumber === 0) {
											photoNumber = 0;
											$('#previewPreviousImg').removeClass('buttonLeftActive');
											$('#previewPreviousImg').addClass('buttonLeftDeactive');
										}
										$('#imagePreview' + photoNumber).css({
											'display' : 'block'
										});
										$('#photoNumber').val(photoNumber);
										$('.photoNumbers').html(parseInt(photoNumber + 1) + " of " + images.length);
									}
								});
								$('#previewNextImg').click(function() {
									if (images.length > 1) {
										photoNumber = parseInt($('#photoNumber').val());
										$('#imagePreview' + photoNumber).css({
											'display' : 'none'
										});
										photoNumber += 1;
										if (photoNumber === images.length)
											photoNumber = images.length - 1;
										$('#previewPreviousImg').removeClass('buttonLeftDeactive');
										$('#previewPreviousImg').addClass('buttonLeftActive');
										if (photoNumber === images.length - 1) {
											photoNumber = images.length - 1;
											$('#previewNextImg').removeClass('buttonRightActive');
											$('#previewNextImg').addClass('buttonRightDeactive');
										}
										$('#imagePreview' + photoNumber).css({
											'display' : 'block'
										});
										$('#photoNumber').val(photoNumber);
										$('.photoNumbers').html(parseInt(photoNumber + 1) + " of " + images.length);
									}
								});
							}
						} else if (images.length === 0) {
							$('#closePreview').css({
								"margin-right" : "-206px"
							});
							$('#previewTitle').css({
								"width" : "495px"
							});
							$('#previewDescription').css({
								"width" : "495px"
							});
							$('#previewInputDescription').css({
								"width" : "495px"
							});
							contentWidth = 495;
							$('#previewButtons').hide();
							$('#noThumb').hide();
							$('.nT').hide();
						}
						if (nT === false) {
							nT = true;
							$('.nT').click(function() {
								var noThumb = $('#noThumb').attr("checked");
								if (noThumb !== "checked") {
									$('#noThumb').attr("checked", "checked");
									$('#imagePreview' + photoNumber).css({
										'display' : 'none'
									});
									$('#whiteImage').css({
										'display' : 'block'
									});
									$('#previewButtons').hide();
								} else {
									$('#noThumb').removeAttr("checked");
									$('#imagePreview' + photoNumber).css({
										'display' : 'block'
									});
									$('#whiteImage').css({
										'display' : 'none'
									});
									$('#previewButtons').show();
								}
							});
						}
						$('#previewSpanTitle').click(function() {
							if (blockTitle === false) {
								blockTitle = true;
								$('#previewSpanTitle').hide();
								$('#previewInputTitle').show();
								$('#previewInputTitle').val($('#previewInputTitle').val());
								$('#previewInputTitle').focus().select();
							}
						});
						$('#previewInputTitle').blur(function() {
							blockTitle = false;
							$('#previewSpanTitle').html($('#previewInputTitle').val());
							$('#previewSpanTitle').show();
							$('#previewInputTitle').hide();
						});
						$('#previewInputTitle').keypress(function(e) {
							if (e.which === 13) {
								blockTitle = false;
								$('#previewSpanTitle').html($('#previewInputTitle').val());
								$('#previewSpanTitle').show();
								$('#previewInputTitle').hide();
							}
						});
						$('#previewSpanDescription').click(function() {
							if (blockDescription === false) {
								blockDescription = true;
								$('#previewSpanDescription').hide();
								$('#previewInputDescription').show();
								$('#previewInputDescription').val($('#previewInputDescription').val());
								$('#previewInputDescription').focus().select();
							}
						});
						$('#previewInputDescription').blur(function() {
							blockDescription = false;
							$('#previewSpanDescription').html($('#previewInputDescription').val());
							$('#previewSpanDescription').show();
							$('#previewInputDescription').hide();
						});
						$('#previewInputDescription').keypress(function(e) {
							if (e.which === 13) {
								blockDescription = false;
								$('#previewSpanDescription').html($('#previewInputDescription').val());
								$('#previewSpanDescription').show();
								$('#previewInputDescription').hide();
							}
						});
						$('#previewSpanTitle').mouseover(function() {
							$('#previewSpanTitle').css({
								"background-color" : "#ff9"
							});
						});
						$('#previewSpanTitle').mouseout(function() {
							$('#previewSpanTitle').css({
								"background-color" : "transparent"
							});
						});
						$('#previewSpanDescription').mouseover(function() {
							$('#previewSpanDescription').css({
								"background-color" : "#ff9"
							});
						});
						$('#previewSpanDescription').mouseout(function() {
							$('#previewSpanDescription').css({
								"background-color" : "transparent"
							});
						});
						$('#noThumb').click(function() {
							var noThumb = $(this).attr("checked");
							if (noThumb !== "checked") {
								$('#imagePreview' + photoNumber).css({
									'display' : 'block'
								});
								$('#whiteImage').css({
									'display' : 'none'
								});
								$('#previewButtons').show();
							} else {
								$('#imagePreview' + photoNumber).css({
									'display' : 'none'
								});
								$('#whiteImage').css({
									'display' : 'block'
								});
								$('#previewButtons').hide();
							}
						});
						$('#closePreview').click(function() {
							block = false;
							hrefUrl = '';
							fancyUrl = '';
							images = '';
							video = '';
							$('#preview').fadeOut("fast", function() {
								$('#text').css({
									"border" : "1px solid #b3b3b3",
									"border-bottom" : "1px solid #e6e6e6"
								});
								$('#previewImage').html("");
								$('#previewTitle').html("");
								$('#previewUrl').html("");
								$('#previewDescription').html("");
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
		});

		$('#postPreview').click(function() {
			imageId = "";
			pTP = "";
			pDP = "";
			text = " " + $('#text').val();
			title = $('#previewTitle').html();
			description = $('#previewDescription').html();

			if (((trim(text) !== "") || (trim(text) === "" && trim(hrefUrl) !== "")) && (allowPosting === true && isCrawling === false)) {
				$.get('php/highlightUrls.php', {
					text : text,
					description : description
				}, function(urls) {
					if ($('#noThumb').attr("checked") === "checked" || images.length === 0) {
						contentWidth = 495;
						leftSideContent = "";
					} else if (images || video) {
						if (video === "yes") {
							var pattern = /id="(.+?)"/i;
							imageId = videoIframe.match(pattern);
							imageId = imageId[1];
							pTP = "pTP" + imageId;
							pDP = "pDP" + imageId;
							imageId = "img" + imageId;
							image = "<img id='" + imageId + "' src='" + $('#imagePreview' + photoNumber).attr("src") + "' class='imgIframe' style='width: 130px; height: auto; float: left;' ></img>";
							videoPlay = '<span class="videoPostPlay"></span>';
							leftSideContent = image + videoPlay;
						} else {
							image = "<img src='" + $('#imagePreview' + photoNumber).attr("src") + "' style='width: 130px; height: auto; float: left;' ></img>";
							leftSideContent = '<a href="' + hrefUrl + '" target="_blank">' + image + '</a>';
						}
					}
					content = '<div class="previewPosted">' + '<div class="previewTextPosted">' + urls.urls + '</div>' + videoIframe + '<div class="previewImagesPosted">' + '<div class="previewImagePosted">' + leftSideContent + '</div>' + '</div>' + '<div class="previewContentPosted">' + '<div class="previewTitlePosted" id="' + pTP + '" style="width: ' + contentWidth + 'px" ><a href="' + hrefUrl + '" target="_blank">' + title + '</a></div>' + '<div class="previewUrlPosted">' + fancyUrl + '</div>' + '<div class="previewDescriptionPosted" id="' + pDP + '" style="width: ' + contentWidth + 'px" >' + urls.description + '</div>' + '</div>' + '<div style="clear: both"></div>' + '</div>';

					$('#preview').fadeOut("fast", function() {
						$('#text').css({
							"border" : "1px solid #b3b3b3",
							"border-bottom" : "1px solid #e6e6e6"
						});
						$('#text').val("");
						$('#previewImage').html("");
						$('#previewTitle').html("");
						$('#previewUrl').html("");
						$('#previewDescription').html("");
						$(content).hide().prependTo('.previewPostedList').fadeIn("fast");
						$(".imgIframe").click(function() {
							var oldId = $(this).attr("id");
							var currentId = oldId.substring(3);
							pTP = "pTP" + currentId;
							pDP = "pDP" + currentId;
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
					});
					block = false;
					hrefUrl = '';
					fancyUrl = '';
					images = '';
					video = '';
				}, "json");
				text = "";
			}
		});

	};
})(jQuery);
