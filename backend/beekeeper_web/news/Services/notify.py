from news.models import News


def create_default_news_text(news: News):
    return f"Новая новость, '{news.title}'"
