class TodoChannel < ApplicationCable::Channel
  def subscribed
    stream_from "todo_channel"
  end

  def unsubscribed
  end
end
