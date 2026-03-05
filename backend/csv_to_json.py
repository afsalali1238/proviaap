"""
Convert Check_Final_No_Media.csv to provia_question_bank.json
Only includes required fields for the app: day, text, options, correctAnswer, explanation, category
Excludes extra columns: Source, Page, Media Required, Manual Review Required, Fix_Status
"""
import csv
import json
import os

# Paths
CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Check_Final_No_Media.csv')
JSON_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'provia_question_bank.json')

def csv_to_json():
    questions = []
    skipped = 0
    
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            question_text = row.get('Question', '').strip()
            option_a = row.get('Option A', '').strip()
            option_b = row.get('Option B', '').strip()
            option_c = row.get('Option C', '').strip()
            option_d = row.get('Option D', '').strip()
            correct_answer_text = row.get('Correct Answer', '').strip()
            rationale = row.get('Rationale', '').strip()
            difficulty = row.get('Difficulty', '').strip()
            domain = row.get('Domain', '').strip()
            topic = row.get('Topic', '').strip()
            sub_topic = row.get('Sub-Topic', '').strip()
            day_str = row.get('Day', '').strip()
            question_id = row.get('Question_ID', '').strip()
            
            # Skip if no question text
            if not question_text:
                skipped += 1
                continue
            
            # Build options list (filter empty options)
            options = [opt for opt in [option_a, option_b, option_c, option_d] if opt]
            
            if len(options) < 2:
                skipped += 1
                print(f"Skipped {question_id}: Less than 2 options")
                continue
            
            # Map correct answer text to index (0-based)
            correct_index = -1
            for i, opt in enumerate(options):
                if opt.strip().lower() == correct_answer_text.strip().lower():
                    correct_index = i
                    break
            
            # If exact match failed, try partial matching
            if correct_index == -1:
                for i, opt in enumerate(options):
                    if correct_answer_text.strip().lower() in opt.strip().lower() or opt.strip().lower() in correct_answer_text.strip().lower():
                        correct_index = i
                        break
            
            if correct_index == -1:
                print(f"Warning {question_id}: Could not match answer '{correct_answer_text[:50]}' to options. Defaulting to 0.")
                correct_index = 0
            
            # Parse day
            try:
                day = int(day_str) if day_str else 1
            except ValueError:
                day = 1
            
            # Build question object with only required fields
            question_obj = {
                "day": day,
                "text": question_text,
                "options": options,
                "correctAnswer": correct_index,
                "explanation": rationale if rationale else f"Correct answer: {correct_answer_text}",
                "category": domain if domain else "General"
            }
            
            questions.append(question_obj)
    
    # Write JSON
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=4, ensure_ascii=False)
    
    print(f"\n=== Conversion Complete ===")
    print(f"Total questions converted: {len(questions)}")
    print(f"Skipped: {skipped}")
    print(f"Output: {JSON_PATH}")

if __name__ == '__main__':
    csv_to_json()
