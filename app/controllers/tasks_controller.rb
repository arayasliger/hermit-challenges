class TasksController < ApplicationController
  before_action :set_task, only: [ :destroy ]

  def index
    @tasks = Task.all
    @task = Task.new
  end
  def create
    @task = Task.new(task_params)

    if @task.save
      ActionCable.server.broadcast("todo_channel", { task: @task.name })
    end
  end

  def destroy
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:name)
  end
end
