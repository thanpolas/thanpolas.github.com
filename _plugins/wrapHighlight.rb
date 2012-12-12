module Jekyll

  class WrapHighlightBlock < Jekyll::HighlightBlock
    #include Liquid::StandardFilters

    def initialize(tag_name, markup, tokens)
      super
    end
    def render(context)
      prefix = "<figure class=\"code\"><figcaption></figcaption>"
      suffix = "</figure>"
      #prefix + super + suffix
      "<figure class=\"code\"><figcaption></figcaption>" + super + "</figure>"
    end
  end
end

Liquid::Template.register_tag('highlight', Jekyll::WrapHighlightBlock)
