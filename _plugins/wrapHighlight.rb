module Jekyll

  class WrapHighlightBlock < Jekyll::HighlightBlock
    #include Liquid::StandardFilters

    def initialize(tag_name, markup, tokens)
      super
    end
    def render(context)
      prefix = "\n<figure class=\"code\"><figcaption></figcaption>"
      suffix = "</figure>\n"
      prefix + super + suffix
    end
  end
end

Liquid::Template.register_tag('highlight', Jekyll::WrapHighlightBlock)
