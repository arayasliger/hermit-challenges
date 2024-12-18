class PagesController < ApplicationController
  def home
  end

  def canvas
  end

  def todo
    @tasks = Task.all
  end
end
