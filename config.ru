require 'rubygems'
require 'bundler'

$stdout.sync = true

Bundler.require

#ENV['DATABASE_URL']

require './clickhere'
run Sinatra::Application
