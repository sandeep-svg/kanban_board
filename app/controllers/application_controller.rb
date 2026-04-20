class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  skip_before_action :verify_authenticity_token, if: :json_request?

  private

  def json_request?
    request.format.json? || request.headers['Content-Type']&.include?('application/json')
  end
end