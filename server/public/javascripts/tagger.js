var Tagger = (function () {
    var container = null;
    var tagDiv    = null;

    // Initialize html snippets (TODO: Think how to make this smarter)
    var tagger_html = '<div class="tags"></div>\
                <a id="addTagAction" class="tagger_action">\
                  <img src="images/add_button.png" alt="Add tags" class="tagger_action_img">\
                </a>';

    var

    var Tagger = function () {
    };

    Tagger.prototype = {

      init: function(container) {
        this.container = container;
        $(this.container).append(tagger_html);
        this.registerCallbacks();
      },

      create: function () {
        console.log("createTag");
        var tag_text = $("#tagEditor").text();
        if (tag_text != "") {
          $(this.tagDiv).append('<div class="tag rounded floatLeft">'+
                                    tag_text +
                                    '<a href="#" class="remove_tag"> \
                                      <img class="tag_x" src="images/tiny_x.png">\
                                      </img>\
                                    </a>\
                                  </div>');
        }
      },

      render: function(tags) {
        console.log("render tags: " + tags)
        this.tags = tags;
      }

      closeTagEditor: function () {
        console.log("closeEditor");
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