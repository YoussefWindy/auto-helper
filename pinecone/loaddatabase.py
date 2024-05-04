import os
from dotenv import load_dotenv
from langchain_community.document_loaders import JSONLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_pinecone import Pinecone
from langchain_openai.chat_models import ChatOpenAI

load_dotenv()


# loader = JSONLoader(
#     file_path='./example_data/facebook_chat.json',
#     jq_schema='.messages[].content',
#     text_content=False)

# data = loader.load()

# nextjs-rag-langchain/src/data/scraper.json
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def load():
    # try:
        # Loading JSON FILE and splitting
        loader = JSONLoader(
            file_path="../nextjs-rag-langchain/src/data/scraper.json",
            jq_schema = '.messages[]',
            text_content=False)

        text_documents = loader.load()
        print(text_documents)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        documents = text_splitter.split_documents(text_documents)

        embeddings = OpenAIEmbeddings()
        pinecone = PineconeVectorStore.from_documents(
            documents, embeddings, index_name="carindex"
        )

    # except Exception as e:
    #     print(f"An error occurred: {e}")

load()