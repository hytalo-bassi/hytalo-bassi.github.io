source "https://rubygems.org"
ruby "3.4.2"

gem "jekyll", "4.4.1"
gem "minima", "2.5.2"
gem "jekyll-sass-converter", "3.1.0"
gem "json", "2.16.0"
gem "bigdecimal", "3.3.1"
gem "logger", "1.7.0"
gem "csv", "3.3.5"

group :jekyll_plugins do
  gem "jekyll-redirect-from", "0.16.0"
  gem "jekyll-toc", "0.19.0"
  gem "jekyll_picture_tag", "2.1.3"
  gem "jekyll-feed", "0.17.0"
end

platforms :windows do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "0.2.0", :platforms => [:windows]

gem "http_parser.rb", "0.6.0", :platforms => [:jruby]

group :development do
  gem "scss_lint", "0.60.0", require: false
end
