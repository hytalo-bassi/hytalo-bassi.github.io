###
### This script is inteded to validate posts.
###
### A post is considered valid when:
### -   It has a known author or does not have authors at all(anonymous)
### -   It uses well defined categories
### -   It has a title
### -   It has a valid date
### -   It has only valid Front Matter properties.
### -   It has thumbnail picture
###
import os
import sys
import yaml

POSTS_DIR = "./_posts"
AUTHORS_DIR = "./_authors"
CONFIG_PATH = "./_config.yml"
VIOLATIONS_MSG = {
    "noTitle": "Missing title!",
    "noDate": "Missing date",
    "noThumbnail": "No image defined!",
    "categorySubcategory": "Using more than 1 sub-category!",
    "unknownAuthor": "Author not found (typo?)",
    "unknownFrontmatter": "Front matter using unknown properties",
    "unallowedFrontMatterProp": "Front matter property not allowed!",
    "unallowedCategory": "Category is not allowed!"
}
ALLOWED_FRONTMATTER_PROPS = [
    "image",
    "permalink",
    "title",
    "layout",
    "categories",
    "tags",
    "date",
    "authors",
    "excerpt",
    "redirect_from"
]

class Validator:
    def __init__(self, valid_author_usernames = None, obj = None, valid_categories = None):
        self.set_violations()
        self.set_object(obj)
        self.valid_categories = valid_categories

        if valid_author_usernames is None:
            self.valid_authors = get_author_usernames()
        else:
            self.valid_authors = valid_author_usernames

        if valid_categories is None:
            config = get_config(os.path.abspath(CONFIG_PATH))
            if "valid_categories" in config:
                self.valid_categories = config["valid_categories"]
            else:
                self.valid_categories = []


    def need_obj(func):
        def wrapper(self):
            if not self.is_obj_set():
                return
            func(self)
        
        return wrapper


    def print_violations(self, start = "\t- ", meta_start = "\t\t"):
        for v in self._violations:
            if (self._violations[v][0]):
                print(f"{start}{v}: {VIOLATIONS_MSG[v] if v in VIOLATIONS_MSG else "no message"}")
                if not self._violations[v][1] == "":
                    print(f"{meta_start}{self._violations[v][1]}")
                


    def is_post_valid(self):
        for v in self._violations:
            if self._violations[v][0]:
                return False

        return True


    def is_obj_set(self):
        return self._obj is not None


    @need_obj
    def title_validator(self):
        if "title" not in self._obj:
            self.violate("noTitle", "possible fix: add title to Front matter")


    @need_obj
    def date_validator(self):
        if "date" not in self._obj:
            self.violate("noDate", "possible fix: add date to Front matter")


    @need_obj
    def image_validator(self):
        if "image" not in self._obj:
            self.violate("noThumbnail", "possible fix: add image to Front matter")

    
    @need_obj
    def front_matter_validator(self):
        for prop in self._obj:
            if prop not in ALLOWED_FRONTMATTER_PROPS:
                self.violate("unallowedFrontMatterProp", f"{prop} is not allowed!")
                return

    def is_author_valid(self, author):
        return author in self.valid_authors


    @need_obj
    def authors_validator(self):
        if "authors" in self._obj:
            if isinstance(self._obj["authors"], list):
                for author in obj["authors"]:
                    if not self.is_author_valid(author):
                        self.violate("unknownAuthor", f"{author} not found!")
                        return
            else:
                if not self.is_author_valid(self._obj["authors"]):
                    self.violate("unknownAuthor", f"{self._obj["authors"]} not found!")


    # Categories validator just works for category and sub-category only. No more than
    # two categories.
    @need_obj
    def categories_validator(self, category_divisor = " "):
        if "categories" not in self._obj:
            return
        
        categories = self._obj["categories"]
        if isinstance(self._obj["categories"], str):
            categories = self._obj["categories"].split(category_divisor)

        if len(categories) > 2:
            self.violate("categorySubcategory")
            return

        if categories[0] not in self.valid_categories:
            self.violate("unallowedCategory", f"{categories[0]} is not allowed!")
            return

        if len(categories) > 1 and categories[1] not in self.valid_categories[categories[0]]:
            self.violate("unallowedCategory", f"{categories[1]} is not allowed!")


    @need_obj
    def all_validator(self):
        self.title_validator()
        self.date_validator()
        self.image_validator()
        self.authors_validator()
        self.front_matter_validator()
        self.categories_validator()


    def violate(self, rule, meta = ""):
        if rule not in self._violations:
            return

        self._violations[rule][0] = True
        self._violations[rule][1] = meta

    def set_violations(self):
        # Violation's scheme:
        #   "ruleName": [
        #       bool rule_violated: True if rule was violated,
        #       string meta: says something about the error or some fix
        #   ]
        self._violations = {}

        violation_keys = [
            "noDate",
            "noThumbnail",
            "noTitle",
            "unallowedCategory",
            "unallowedFrontMatterProp",
            "unknownAuthor",
            "unknownFrontmatter",
            "categorySubcategory"
        ]

        for violation in violation_keys:
            self._violations[violation] = [False, ""]

    def set_object(self, obj = None):
        self._obj = obj


def parse_posts(directory = "_posts"):
    """
    Find all files under the specified directory and extract YAML front matter from each file.
    
    Args:
        directory (str): The directory to search, defaults to "_posts"
        
    Returns:
        list: A list of tuples, each containing (absolute_file_path, yaml_content)
    """
    results = []
    
    if not os.path.exists(directory):
        print(f"Directory '{directory}' does not exist.")
        return results
    
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.abspath(os.path.join(root, file))
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if content.startswith('---'):
                    end_delimiter_pos = content.find('---', 3)
                    if end_delimiter_pos != -1:
                        yaml_text = content[3:end_delimiter_pos].strip()
                        try:
                            results.append((file_path, parse_yaml(yaml_text)))
                        except yaml.YAMLError as e:
                            print(f"Error parsing YAML in {file_path}: {e}")
            
            except Exception as e:
                print(f"Error processing file {file_path}: {e}")
    
    return results


# Parses a YAML text
# Can raise an YAMLError
def parse_yaml(yaml_text):
    yaml_content = yaml.safe_load(yaml_text)
    return yaml_content


def get_config(config_path):
    with open(config_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    return parse_yaml(content)


def get_author_usernames():
    """
    Returns a list of strings containing the authors usernames.
    
    Returns:
        list: A list of usernames
    """
    
    if not os.path.exists(AUTHORS_DIR):
        print(f"Directory '{AUTHORS_DIR}' not found")
        return []
    
    files = os.listdir(AUTHORS_DIR)
    
    files_without_extension = [os.path.splitext(file)[0] for file in files]
    
    return files_without_extension


if __name__ == "__main__":
    posts_files = parse_posts(POSTS_DIR)
    validator = Validator()
    invalid = False

    for post in posts_files:
        validator.set_object(post[1])
        validator.all_validator()

        if not validator.is_post_valid():
            invalid = True
            print(post[0])
            validator.print_violations()
        else:
            print(f"{post[0]}: valid!")

        validator.set_violations()
    
    if invalid:
        sys.exit(1)
