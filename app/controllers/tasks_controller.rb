class TasksController < ApplicationController
  def create
    task = Task.new(task_params)
    task.save
    redirect_to todo_path
  end

  private

  def task_params
    params.require(:task).permit(:name)
  end
end
