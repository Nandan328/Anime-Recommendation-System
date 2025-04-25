import pickle, sys, os
from sklearn.metrics.pairwise import cosine_similarity

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models.pkl")
if not os.path.exists(MODEL_PATH):
    print(f"models.pkl not found at {MODEL_PATH}", file=sys.stderr)
    sys.exit(1)

try:
    with open(MODEL_PATH, "rb") as f:
        models = pickle.load(f)
    mlb = models["mlb"]
    svd = models["svd"]
    scaler = models["scaler"]
    data1 = models["data"]

    genre_matrix = mlb.transform(data1["genre"])
    genre_svd = svd.transform(genre_matrix)
    genre_similarity = cosine_similarity(genre_svd)
    views_normalized = scaler.transform(data1[["members"]])
except Exception as e:
    print(f"Error loading models: {e}", file=sys.stderr)
    sys.exit(1)


def recommend_anime_by_name(anime_name):
    matches = data1[data1["name"] == anime_name]
    if matches.empty:
        print(f"Anime '{anime_name}' not found.", file=sys.stderr)
        sys.exit(2)
    anime_index = matches.index[0]
    genre_similarities = genre_similarity[anime_index]
    views_similarity = views_normalized.flatten()
    combined_similarity = 0.9 * genre_similarities + 0.1 * views_similarity
    similar_indices = combined_similarity.argsort()[::-1][1:11]
    recommended_animes = data1.iloc[similar_indices]
    return [i for i in recommended_animes["name"] if i != anime_name]


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No anime name provided.", file=sys.stderr)
        sys.exit(3)
    anime_name = sys.argv[1]
    try:
        recommended_animes = recommend_anime_by_name(anime_name)
        print(recommended_animes)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(4)
