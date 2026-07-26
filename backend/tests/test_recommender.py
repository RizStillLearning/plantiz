import unittest

from app.schemas import EnvironmentRequest
from app.services.recommender import recommend_plants


class RecommenderTests(unittest.TestCase):
    def test_high_dryness_prefers_drought_tolerant_plants(self) -> None:
        env = EnvironmentRequest(
            light="bright",
            humidity="low",
            temperature_c=28,
            space="small",
            experience="beginner",
            pets=False,
            dryness="high",
        )

        results = recommend_plants(env, top_n=5)

        self.assertTrue(results)
        self.assertTrue(any(result.common_name == "Aloe Vera" for result in results[:3]))


if __name__ == "__main__":
    unittest.main()
