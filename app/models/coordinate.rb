class Coordinate < ApplicationRecord
  before_create :set_defaults

  private

  def set_defaults
    self.color = "black" if color.blank?
    self.shape = "circle" if shape.blank?
  end
end
