Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  root "pages#home"

  get "canvas", to: "pages#canvas"
  resources :articles

  get "lists", to: "list#index"
  get "items/create"
  resources :list, only: [ :index ]
  resources :items, only: [ :create, :destroy, :update ]
  resources :items do
    member do
      patch :toggle_completed
    end
  end

  get "map", to: "map#index"
  resources :coordinates, only: [ :create, :update, :destroy ]
end
