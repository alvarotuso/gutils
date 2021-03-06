// Generated by CoffeeScript 1.9.1
(function() {
  this.TypeaheadController = (function() {
    function TypeaheadController() {
      this.cancel_add_button = $("#add_model_modal-cancel-button");
      this.confirm_add_button = $("#add_model_modal-confirm-button");
      this.modal_dialog = $("#add_model_modal");
      this.contenedor = $("#contenedor_add_model");
      this.sources = {};
    }

    TypeaheadController.prototype.refresh_description = function(form_input, typeahead_url, lookup_name, typeahead_input) {
      var url;
      url = typeahead_url + '?lookup=' + lookup_name + '&form_input_value=' + $(form_input).val();
      return $.get(url, function(data) {
        return $(typeahead_input).val(data.description);
      });
    };

    TypeaheadController.prototype.open_add_model_form = function(typeahead_input) {
      var add_url;
      add_url = typeahead_input.getAttribute("data-add-url");
      return $.get(add_url, (function(_this) {
        return function(data) {
          $(_this.contenedor).html(data);
          $(_this.modal_dialog).find("#modal_title").html(typeahead_input.getAttribute("data-lookup-model-description"));
          mainController.configure_controls();
          $(_this.modal_dialog).modal('show');
          $(_this.confirm_add_button).off('click');
          $(_this.confirm_add_button).click(function() {
            return _this.confirm_add_model_form(typeahead_input);
          });
          $(_this.cancel_add_button).off('click');
          return $(_this.cancel_add_button).click(function() {
            return _this.close_add_model_form();
          });
        };
      })(this));
    };

    TypeaheadController.prototype.confirm_add_model_form = function(typeahead_input) {
      var add_url, post_data;
      add_url = typeahead_input.getAttribute("data-add-url");
      post_data = $(this.contenedor).find("*").serialize();
      return $.post(add_url, post_data, (function(_this) {
        return function(data) {
          if (typeof data === "object") {
            $(typeahead_input).val(data.instance_id);
            return _this.close_add_model_form();
          } else {
            $(_this.contenedor).html(data);
            return mainController.configure_controls();
          }
        };
      })(this));
    };

    TypeaheadController.prototype.close_add_model_form = function() {
      return $("#add_model_modal").modal('hide');
    };

    TypeaheadController.prototype.get_source = function(typeahead_url, lookup_name) {
      var source;
      if (lookup_name in this.sources) {
        return this.sources[lookup_name];
      } else {
        source = new Bloodhound({
          hint: false,
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('description'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          remote: typeahead_url + '?lookup=' + lookup_name + '&query=%QUERY'
        });
        source.initialize();
        this.sources[lookup_name] = source;
      }
      return source;
    };

    TypeaheadController.prototype.register_typeaheads = function() {
      var typeahead_form_inputs;
      typeahead_form_inputs = $(".typeahead-form-input").filter(function() {
        return this.getAttribute("data-lookup-activated") === 'false';
      });
      return $(typeahead_form_inputs).each((function(_this) {
        return function(index, form_input) {
          var addmodel, dropdown, form_group_div, initial_description, label, lookup_input_id, lookup_name, typeahead, typeahead_div, typeahead_input, typeahead_input_title, typeahead_url;
          lookup_input_id = form_input.getAttribute("id") + "-typeahead";
          lookup_name = form_input.getAttribute("data-lookup-name");
          typeahead_url = form_input.getAttribute("data-lookup-url");
          initial_description = form_input.getAttribute("data-initial-description");
          form_group_div = form_input.parentNode.parentNode;
          typeahead_div = form_input.parentNode;
          typeahead_input_title = $(form_input).prop("title");
          typeahead_input = document.createElement('input');
          typeahead_input.setAttribute('type', 'text');
          if ($(form_input).hasClass("with_errors")) {
            typeahead_input.setAttribute('class', 'with_errors');
          }
          typeahead_input.setAttribute('class', typeahead_input.getAttribute('class') + ' form-control');
          typeahead_input.setAttribute('title', typeahead_input_title);
          typeahead_input.setAttribute('id', lookup_input_id);
          typeahead_div.insertBefore(typeahead_input, form_input.nextSibling);
          label = $(form_group_div).find('label');
          if ($(label).length === 1) {
            $(label)[0].setAttribute('for', lookup_input_id);
          }
          $(typeahead_input).typeahead(null, {
            name: lookup_name,
            displayKey: 'description',
            source: _this.get_source(typeahead_url, lookup_name).ttAdapter(),
            minLength: 0
          }).on('typeahead:selected', function(object, datum) {
            return $(form_input).val(datum.id);
          });
          $(typeahead_input).change(function() {
            if ($(this).val() === '') {
              return $(form_input).val('');
            }
          });
          $(form_input).watch('value', function() {
            var initial_value;
            initial_value = form_input.getAttribute("data-initial-value");
            initial_description = form_input.getAttribute("data-initial-description");
            if ($(form_input).val() !== initial_value || $(typeahead_input).val() !== initial_description) {
              $(form_input).trigger('change');
              return _this.refresh_description(form_input, typeahead_url, lookup_name, typeahead_input);
            }
          });
          typeahead = $(typeahead_input).data('ttTypeahead');
          dropdown = $(form_group_div).find("#" + lookup_input_id + "-dropdown");
          $(dropdown).off("click");
          $(dropdown).click(function() {
            $(this).focus();
            if (!$(this).hasClass("data-clicked")) {
              $(this).addClass("data-clicked");
              return typeahead._openResults();
            } else {
              $(this).removeClass("data-clicked");
              return typeahead._onBlurred();
            }
          });
          $(dropdown).off("blur");
          $(dropdown).blur(function() {
            typeahead._onBlurred();
            return $(dropdown).removeClass("data-clicked");
          });
          addmodel = $(form_group_div).find("#" + lookup_input_id + "-dropdown-add");
          $(addmodel).off('click');
          $(addmodel).click(function() {
            return _this.open_add_model_form(form_input);
          });
          typeahead.input.setQuery(initial_description);
          $(typeahead_input).val(initial_description);
          return form_input.setAttribute("data-lookup-activated", "true");
        };
      })(this));
    };

    return TypeaheadController;

  })();

  window.typeaheadController = new TypeaheadController();

}).call(this);

//# sourceMappingURL=typeahead_controller.js.map
