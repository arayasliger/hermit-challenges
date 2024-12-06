class Article < ApplicationRecord
  validates :title, presence: true

  def content_to_html
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, autolink: true, tables: true)
    markdown.render(content).html_safe
  end
end
