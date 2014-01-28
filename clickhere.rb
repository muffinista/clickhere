require 'rubygems'
require 'sinatra'
require 'sequel'

set :server, 'thin'
connections = []

DB = Sequel.connect(ENV['DATABASE_URL'] || 'mysql://root@localhost/clickhere')

get '/stream', :provides => 'text/event-stream' do
  stream :keep_open do |out|
    connections << out
    out.callback {
      logger.warn 'happy close'
      connections.delete(out)
    }
    out.errback do
      logger.warn 'we just lost a connection!'
      connections.delete(out)
    end
  end
end

post '/point' do
  data = {'created_at' => Time.now, 'ip' => request.ip}.merge(params)
  logger.warn data.inspect
  DB[:points].insert(data)

  params[:users] = connections.count
  connections.each { |out| out << "data: #{Oj.dump(params, mode: :compat)}\n\n" }  

  Oj.dump({:users => connections.count}, mode: :compat)
  #204 # response without entity body
end

get '/data' do
  content_type :json
  Oj.dump(DB[:points].all, mode: :compat)
end
