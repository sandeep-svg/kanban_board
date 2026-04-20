Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "/" => "home#index"

  resources :cards, only: [:create, :update, :destroy] do
    member do
      post :move
    end
  end

  get "/board/history", to: "cards#history"
  get "/board/events", to: "cards#events"
  get "/board/time_range", to: "cards#time_range"
end
