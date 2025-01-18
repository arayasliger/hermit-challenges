class Coordinate < ApplicationRecord
  before_create :set_defaults

  private

  def set_defaults
    self.color ||= "black"
    self.shape ||= "circle"
  end
end
