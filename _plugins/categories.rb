# Code adapted from https://uhded.com/automatic-jekyll-categories-page
module Jekyll
    class CategoryPageGenerator < Generator
      safe true
  
      def generate(site)
        if site.layouts.key? 'category_posts'
          dir = site.config['category_dir'] || 'categories'
          site.config['valid_categories'].each_key do |category|
            site.pages << CategoryPage.new(site, site.source, File.join(dir, category), category)
          end
        end
      end
    end
  
    class CategoryPage < Page
      def initialize(site, base, dir, category)
        @site = site
        @base = base
        @dir  = dir
        @name = 'index.html'
  
        self.process(@name)
        self.read_yaml(File.join(base, '_layouts'), 'category_posts.html')
        self.data['category'] = category
  
        self.data['title'] = category
      end
    end
  end
  