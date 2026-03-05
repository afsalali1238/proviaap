import json
import os

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
json_path = os.path.join(BASE_DIR, 'final_questions.json')
output_path = os.path.join(BASE_DIR, 'frontend', 'src', 'features', 'questions', 'data', 'mockQuestions.ts')

with open(json_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Group questions by their assigned day
days_count = 45
questions_per_day = {i: [] for i in range(1, days_count + 1)}

valid_count = 0

for idx, q in enumerate(questions):
    try:
        options = [opt.strip().replace('"', '\\"').replace('\n', ' ') for opt in q.get("options", [])]
        correct_idx = int(q.get("correctAnswer", 0))
        text = q.get("text", "Question").strip().replace('"', '\\"').replace('\n', ' ')
        explanation = q.get("explanation", "").strip().replace('"', '\\"').replace('\n', ' ')
        category = q.get("category", "General").strip().replace('\n', '')
        
        day = int(q.get("day", 1))
        if day < 1 or day > days_count:
            day = 1

        question_obj = {
            "id": q.get("id", f"q_{day}_{idx}"),
            "day": day,
            "text": text,
            "options": options,
            "correctAnswer": correct_idx,
            "explanation": explanation,
            "category": category
        }
        
        questions_per_day[day].append(question_obj)
        valid_count += 1
            
    except Exception as e:
        print(f"Error processing Q{idx}: {e}")

# Generate TypeScript content
ts_lines = [
    "import type { Question } from '../../quiz/store/quizStore';",
    "",
    "export const MOCK_QUESTIONS: Record<number, Question[]> = {",
]

for day in range(1, days_count + 1):
    day_qs = questions_per_day[day]
    if not day_qs:
        continue
        
    ts_lines.append(f"  {day}: [")
    for q in day_qs:
        ts_lines.append("    {")
        ts_lines.append(f"      id: '{q['id']}',")
        ts_lines.append(f"      dayId: {q['day']},")
        ts_lines.append(f"      question: \"{q['text']}\",")
        ts_lines.append("      options: [")
        for opt in q['options']:
            ts_lines.append(f"        \"{opt}\",")
        ts_lines.append("      ],")
        ts_lines.append(f"      correctAnswer: {q['correctAnswer']},")
        ts_lines.append(f"      explanation: \"{q['explanation']}\",")
        ts_lines.append(f"      topic: \"{q['category']}\",")
        ts_lines.append("    },")
    ts_lines.append("  ],")

ts_lines.append("};")
ts_lines.append("")
ts_lines.append("export const ALL_QUESTIONS: Question[] = Object.values(MOCK_QUESTIONS).flat();")
ts_lines.append("")
ts_lines.append("export const getQuestionsForDay = (day: number): Question[] => {")
ts_lines.append("  return MOCK_QUESTIONS[day] || [];")
ts_lines.append("};")

with open(output_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(ts_lines))

print(f"=== Generation Complete ===")
print(f"Total questions processed: {valid_count}")
print(f"Output: {output_path}")
print(f"\nQuestions per day:")
for day in range(1, days_count + 1):
    count = len(questions_per_day[day])
    if count > 0:
        print(f"  Day {day}: {count} questions")
