class TasksController < ApplicationController
  before_action :set_task, only: [ :destroy ]
  def create
    @task = Task.new(task_params)

    if @task.save
      ActionCable.server.broadcast("todo_channel", { task: @task.name })
      redirect_to todo_path
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
