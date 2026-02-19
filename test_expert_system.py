
# test_expert_system.py
import unittest
from knowledge_base import get_rules
from inference_engine import InferenceEngine

class TestExpertSystem(unittest.TestCase):
    def setUp(self):
        self.rules = get_rules()
        self.engine = InferenceEngine(self.rules)

    def test_all_requirements_met(self):
        facts = {
            "credits_percentage": 100,
            "social_service_completed": True,
            "professional_practices_completed": True,
            "humanist_formation_completed": True,
            "language_requirement_met": True,
            "exit_exam_presented": True,
            "debt_tuition": False,
            "debt_library": False,
            "debt_lab": False,
            "title_fee_paid": True
        }
        success, failed = self.engine.evaluate(facts)
        self.assertTrue(success)
        self.assertEqual(len(failed), 0)

    def test_missing_social_service(self):
        facts = {
            "credits_percentage": 100,
            "social_service_completed": False, # Fail
            "professional_practices_completed": True,
            "humanist_formation_completed": True,
            "language_requirement_met": True,
            "exit_exam_presented": True,
            "debt_tuition": False,
            "debt_library": False,
            "debt_lab": False,
            "title_fee_paid": True
        }
        success, failed = self.engine.evaluate(facts)
        self.assertFalse(success)
        self.assertEqual(len(failed), 1)
        # Checking by name might be language dependent, but let's check correct identification
        self.assertEqual(failed[0]['name'], "Servicio Social")

    def test_existing_debt(self):
        facts = {
            "credits_percentage": 100,
            "social_service_completed": True,
            "professional_practices_completed": True,
            "humanist_formation_completed": True,
            "language_requirement_met": True,
            "exit_exam_presented": True,
            "debt_tuition": True, # Fail
            "debt_library": False,
            "debt_lab": False,
            "title_fee_paid": True
        }
        success, failed = self.engine.evaluate(facts)
        self.assertFalse(success)
        self.assertEqual(len(failed), 1)
        self.assertEqual(failed[0]['name'], "No Adeudos")

if __name__ == '__main__':
    unittest.main()
