var Tagger = (function () {
    var container = null;
    var tagDiv    = null;

    // TODO: Move everything to templatizer
    var tagger_html = '\
                <div class="tags"></div>\
                <a class="tagger_action add_tag_action">\
                  <img src="images/add_button.png" alt="Add tags" class="tagger_action_img">\
                </a>';

    var Tagger = function () {
    };

    Tagger.prototype = {

      init: function(container) {
        this.container = container;
        console.log(container);
        console.log(tagger_html);
        $(this.container).append(tagger_html);
        this.tagDiv = $(this.container).find('.tags');
        this.registerCallbacks();
      },

      create: function (text) {
        console.log("createTag: " + text);
        //var tag_text = $("#tagEditor").text();
        if (text != "") {
          // Using precompiled templates, using templatizer
          var tag_html = templatizer.tagger.tag({'tag_text':text});
          $(this.tagDiv).append(tag_html);
        }
      },

      render: function(tags) {
        console.log("render tags: " + tags)
        this.tags = tags;
        _.each(this.tags, function(tag) {
          this.create(tag);
        }, this);
      },

      closeTagEditor: function () {
        console.log("closeEditor");
        // Create new tag, copy text from editor?
        $(tagEditor).remove();
      },

      tagEditorOpen: function () {
        return ($("#tagEditor").length !== 0);
      },

      createTagEditor: function () {
        console.log("createTagEditor");
        if (tagEditorOpen()) {
          var tagEditor = $("#tagEditor");
          tagEditor.text("");
        }
        else  {
          console.log("create new one");
          $(".tagger").append('<div id="tagEditor" class="tagInput rounded", style="width:160px" contenteditable="true"></div>'); 
          $("#tagEditor").focus();
      
          // On blur, new tags is created
          $("#tagEditor").blur(function() {
            console.log("BLUR");
            createTag(this);
            closeTagEditor();
            $("#addTagAction").show(); // TODO: convert to disabling of all header actions
          });

          // On enter or tab, new tag is created and 
          $("#tagEditor").keydown(function(event) {
            if (event.keyCode === 9) { // tab was pressed and new tag is born
              event.stopPropagation();
              event.preventDefault();
              createTag();
              createTagEditor();
            }
          });
        }
      },

      registerCallbacks: function() {
        $("#addTagAction").click(function() {
          tagContainer = $(this).parent().find('.tags');
          $(this).hide();
          createTagEditor();
        });

        $(document.body).on('click', '.remove_tag' , function() {
          console.log('clicked X');
          $(this).parent(".tag").remove();
        });
      }
    };

    return Tagger;
})();