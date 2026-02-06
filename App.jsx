import React, { useState, useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const DopamineSurvey = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    // Блок А: Мотивация и Психология
    { id: 1, text: "Насколько легко вам заставить себя начать новое или запланированное дело?", coefficient: 1.5, block: "A", blockName: "Мотивация", type: "positive" },
    { id: 2, text: "Как часто вы чувствуете искренний интерес и креативный подъем в работе или учебе?", coefficient: 1.0, block: "A", blockName: "Мотивация", type: "positive" },
    { id: 3, text: "Приносят ли ваши привычные хобби (спорт, чтение) вам такое же удовольствие, как раньше?", coefficient: 1.0, block: "A", blockName: "Мотивация", type: "positive" },
    { id: 4, text: "Как часто вы просыпаетесь с чувством бодрости и готовности к новому дню?", coefficient: 1.5, block: "A", blockName: "Мотивация", type: "positive" },
    
    // Блок Б: Физиология и Резервы
    { id: 5, text: "Присутствует ли белковая пища (мясо, яйца, бобовые) в большинстве ваших приемов пищи?", coefficient: 2.0, block: "B", blockName: "Физиология", type: "positive", customScale: true },
    { id: 6, text: "Насколько стабильно вы можете удерживать фокус на одной задаче, не отвлекаясь?", coefficient: 1.5, block: "B", blockName: "Физиология", type: "positive" },
    { id: 7, text: "Как вы оцениваете качество своего сна (чувствуете ли вы себя отдохнувшим)?", coefficient: 1.5, block: "B", blockName: "Физиология", type: "positive" },
    { id: 8, text: "Как часто вы проводите время на свежем воздухе или при ярком дневном свете?", coefficient: 1.0, block: "B", blockName: "Физиология", type: "positive" },
    { id: 9, text: "Как часто вы занимаетесь спортом или активным движением (хотя бы 20 мин)?", coefficient: 1.5, block: "B", blockName: "Физиология", type: "positive" },
    { id: 10, text: "Практикуете ли вы периоды полного отсутствия гаджетов (например, за едой или перед сном)?", coefficient: 1.0, block: "B", blockName: "Физиология", type: "positive" },
    
    // Блок В: Цифровая нагрузка
    { id: 11, text: "Сколько времени вы тратите на TikTok/Reels/Shorts в день?", coefficient: 2.0, block: "V", blockName: "Цифровая нагрузка", type: "negative", timeScale: true, invertTimeScale: true },
    { id: 12, text: "Как часто вы проверяете уведомления в телефоне без реальной необходимости?", coefficient: 1.5, block: "V", blockName: "Цифровая нагрузка", type: "negative" },
    { id: 13, text: "Мета-вопрос: Насколько сильно вам хочется пролистать этот тест до конца прямо сейчас?", coefficient: 2.0, block: "V", blockName: "Цифровая нагрузка", type: "negative" },
    { id: 14, text: "Чувствуете ли вы раздражение, если приходится долго ждать (в очереди или загрузку видео)?", coefficient: 1.0, block: "V", blockName: "Цифровая нагрузка", type: "negative" },
    
    // Блок Г: Бытовая стимуляция
    { id: 15, text: "Как часто вы употребляете фастфуд или продукты с высоким содержанием сахара?", coefficient: 1.5, block: "G", blockName: "Бытовая стимуляция", type: "negative" },
    { id: 16, text: "Пьете ли вы более 3 чашек кофе или энергетиков в день?", coefficient: 1.0, block: "G", blockName: "Бытовая стимуляция", type: "negative" },
    { id: 17, text: "Склонны ли вы к играм на деньги (ставки, казино) или поиску риска ради «встряски»?", coefficient: 2.0, block: "G", blockName: "Бытовая стимуляция", type: "negative" },
    { id: 18, text: "Чувствуете ли вы необходимость постоянно слушать музыку или подкасты «фоном», когда вы одни?", coefficient: 1.0, block: "G", blockName: "Бытовая стимуляция", type: "negative" },
    { id: 19, text: "Используете ли вы вейпы или никотин (снюс, сигареты)?", coefficient: 2.0, block: "G", blockName: "Бытовая стимуляция", type: "negative" },
  ];

  const getAnswerOptions = (questionId) => {
    const q = questions[questionId - 1];
    
    // Échelles personnalisées
    if (questionId === 1) {
      return [
        { value: 5, label: "Очень легко" },
        { value: 4, label: "Легко" },
        { value: 3, label: "Средне" },
        { value: 2, label: "Сложно" },
        { value: 1, label: "Очень сложно" },
      ];
    } else if (questionId === 7) {
      return [
        { value: 5, label: "Очень хорошее" },
        { value: 4, label: "Хорошее" },
        { value: 3, label: "Средне" },
        { value: 2, label: "Плохо" },
        { value: 1, label: "Очень плохо" },
      ];
    } else if (questionId === 13) {
      return [
        { value: 1, label: "Совсем не хочется" },
        { value: 2, label: "Не хочется" },
        { value: 3, label: "Средне" },
        { value: 4, label: "Хочется" },
        { value: 5, label: "Очень хочется" },
      ];
    } else if (q.customScale) {
      return [
        { value: 5, label: "В каждом основном приеме пищи" },
        { value: 4, label: "Минимум раз в день" },
        { value: 3, label: "Через день" },
        { value: 2, label: "1–2 раза в неделю" },
        { value: 1, label: "Вообще не ем белковую пищу" },
      ];
    } else if (q.timeScale) {
      return [
        { value: 5, label: "Меньше 15 минут" },
        { value: 4, label: "от 15 до 45 минут" },
        { value: 3, label: "от 45 минут до 2 часов" },
        { value: 2, label: "от 2 до 4 часов" },
        { value: 1, label: "Более 4 часов в день" },
      ];
    } else if (q.type === "positive") {
      return [
        { value: 5, label: "Постоянно / Всегда" },
        { value: 4, label: "Часто" },
        { value: 3, label: "Иногда / Время от времени" },
        { value: 2, label: "Редко" },
        { value: 1, label: "Никогда / Почти никогда" },
      ];
    } else {
      return [
        { value: 1, label: "Никогда" },
        { value: 2, label: "Редко" },
        { value: 3, label: "Иногда" },
        { value: 4, label: "Часто" },
        { value: 5, label: "Постоянно" },
      ];
    }
  };

  const calculateResults = useMemo(() => {
    if (Object.keys(answers).length < 19) return null;

    const blocks = {
      A: { name: "Мотивация и Психология", questions: [1, 2, 3, 4], score: 0, maxScore: 0 },
      B: { name: "Физиология и Резервы", questions: [5, 6, 7, 8, 9, 10], score: 0, maxScore: 0 },
      V: { name: "Цифровая нагрузка", questions: [11, 12, 13, 14], score: 0, maxScore: 0 },
      G: { name: "Бытовая стимуляция", questions: [15, 16, 17, 18, 19], score: 0, maxScore: 0 },
    };

    const details = {};

    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer !== undefined) {
        let rawScore;
        if (q.invertTimeScale) {
          // Pour Q11: inverser la logique (moins de temps = mieux)
          rawScore = answer; // Garder la valeur comme est (1=mauvais, 5=bon pour cette question)
        } else if (q.type === "negative") {
          rawScore = 6 - answer;
        } else {
          rawScore = answer;
        }
        const weightedScore = rawScore * q.coefficient;
        const maxWeightedScore = 5 * q.coefficient;

        blocks[q.block].score += weightedScore;
        blocks[q.block].maxScore += maxWeightedScore;

        details[q.id] = {
          answer,
          rawScore,
          weightedScore,
          maxWeightedScore,
          coefficient: q.coefficient,
        };
      }
    });

    // Convertir en pourcentage (0-100)
    const radarData = Object.entries(blocks).map(([key, block]) => ({
      name: block.name.split(" ")[0],
      fullName: block.name,
      value: Math.round((block.score / block.maxScore) * 100),
      score: block.score,
      maxScore: block.maxScore,
    }));

    return { blocks, radarData, details };
  }, [answers]);

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetSurvey = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
  };

  if (showResults && calculateResults) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Результаты анализа уровня дофамина</h1>

          <div className="bg-slate-700 rounded-2xl p-8 mb-8">
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={calculateResults.radarData}>
                <PolarGrid stroke="#94a3b8" />
                <PolarAngleAxis dataKey="name" stroke="#cbd5e1" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar
                  name="Уровень"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  isAnimationActive
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {calculateResults.radarData.map((item, idx) => (
              <div key={idx} className="bg-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">{item.fullName}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-emerald-400">{item.value}%</span>
                  <span className="text-sm text-slate-400">
                    {item.score.toFixed(1)} / {item.maxScore.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-700 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Детальный анализ по вопросам</h2>
            {calculateResults.radarData.map((block) => (
              <div key={block.name} className="mb-8 pb-8 border-b border-slate-600 last:border-b-0">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">{block.fullName}</h3>
                <div className="space-y-3">
                  {block.name === "Мотивация" && calculateResults.blocks.A.questions.map((qId) => (
                    <QuestionDetail key={qId} question={questions[qId - 1]} details={calculateResults.details[qId]} />
                  ))}
                  {block.name === "Физиология" && calculateResults.blocks.B.questions.map((qId) => (
                    <QuestionDetail key={qId} question={questions[qId - 1]} details={calculateResults.details[qId]} />
                  ))}
                  {block.name === "Цифровая" && calculateResults.blocks.V.questions.map((qId) => (
                    <QuestionDetail key={qId} question={questions[qId - 1]} details={calculateResults.details[qId]} />
                  ))}
                  {block.name === "Бытовая" && calculateResults.blocks.G.questions.map((qId) => (
                    <QuestionDetail key={qId} question={questions[qId - 1]} details={calculateResults.details[qId]} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={resetSurvey}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Пройти тест снова
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">Анализ уровня дофамина</h1>
            <span className="text-sm text-slate-400">{currentQuestion + 1}/19</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-700 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              question.block === 'A' ? 'bg-blue-500' :
              question.block === 'B' ? 'bg-green-500' :
              question.block === 'V' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}>
              Блок {question.block}
            </span>
            <span className="text-slate-400 text-sm">Коэффициент: x{question.coefficient}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold mb-8">{question.text}</h2>

          <div className="space-y-3">
            {getAnswerOptions(question.id).map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left p-4 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors font-medium"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="w-full bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
        >
          ← Назад
        </button>
      </div>
    </div>
  );
};

const QuestionDetail = ({ question, details }) => {
  if (!details) return null;
  
  const percentage = (details.weightedScore / details.maxWeightedScore) * 100;

  return (
    <div className="bg-slate-600 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-slate-300 flex-1">Q{question.id}: {question.text}</p>
        <span className="text-sm font-bold text-emerald-400 whitespace-nowrap ml-2">
          {details.weightedScore.toFixed(1)} / {details.maxWeightedScore.toFixed(1)}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded h-2 overflow-hidden">
        <div
          className="bg-emerald-500 h-2 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default DopamineSurvey;
