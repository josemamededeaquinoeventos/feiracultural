/**
 * Jogo das 3 Pistas - Banco de Pistas
 * Cada rodada possui 3 pistas em ordem decrescente de dificuldade (10, 9 e 8 pontos)
 * e uma lista de respostas aceitas (sinônimos/variações).
 */

const PISTAS_PADRAO = [
  {
    palavra: "Computador",
    sinonimos: ["computador", "computadores", "pc", "computador pessoal", "computador de mesa", "microcomputador"],
    categoria: "Tecnologia",
    pistas: [
      "Funciona com sistema binário (zeros e uns)",
      "Possui processador, memória RAM e disco de armazenamento",
      "É usado para navegar na internet, trabalhar e jogar"
    ],
    explicacao: "O computador moderno revolucionou a humanidade desde os primeiros modelos valvulados até os PCs e notebooks atuais."
  },
  {
    palavra: "Inteligência Artificial",
    sinonimos: ["inteligencia artificial", "ia", "ai", "artificial intelligence", "chatgpt", "machine learning"],
    categoria: "Inovação",
    pistas: [
      "Tenta imitar a capacidade de raciocínio e aprendizagem humana",
      "Utiliza redes neurais e grandes volumes de dados para treinar",
      "Gera textos, códigos, imagens e responde perguntas como o ChatGPT"
    ],
    explicacao: "A Inteligência Artificial transforma áreas desde a medicina até a criação de softwares e jogos."
  },
  {
    palavra: "Internet",
    sinonimos: ["internet", "rede mundial", "rede mundial de computadores", "web", "www"],
    categoria: "Conectividade",
    pistas: [
      "Nasceu de um projeto militar chamado ARPANET nos anos 60",
      "Conecta bilhões de dispositivos ao redor de todo o planeta",
      "Você precisa dela para acessar sites, redes sociais e vídeos online"
    ],
    explicacao: "A internet transformou as comunicações globais e é a espinha dorsal do mundo digital contemporâneo."
  },
  {
    palavra: "Robô",
    sinonimos: ["robo", "robos", "robot", "androide", "automato"],
    categoria: "Mecatrônica",
    pistas: [
      "A palavra vem do termo tcheco 'robota', que significa trabalho forçado",
      "É composto por sensores, atuadores e uma programação central",
      "Pode montar carros em fábricas, aspirar o chão ou explorar Marte"
    ],
    explicacao: "De braços industriais a robôs humanoides e aspiradores, a robótica é parte vital da automação."
  },
  {
    palavra: "Videogame",
    sinonimos: ["videogame", "video game", "console", "videojogos", "videojogo", "jogos de videogame"],
    categoria: "E-Sports & Entretenimento",
    pistas: [
      "Um dos seus pioneiros comerciais mais famosos foi o jogo Pong",
      "Disputado com controles, teclado ou fones de ouvido em consoles e PCs",
      "PlayStation, Xbox e Nintendo Switch são os maiores exemplos"
    ],
    explicacao: "A indústria dos videogames e dos e-sports é hoje maior do que as indústrias de cinema e música combinadas."
  },
  {
    palavra: "Celular",
    sinonimos: ["celular", "smartphone", "telefone celular", "aparelho celular", "mobile"],
    categoria: "Tecnologia Móvel",
    pistas: [
      "O primeiro modelo comercial pesava quase 1 kg e foi feito pela Motorola",
      "Usa conexões 4G, 5G, Wi-Fi e telas sensíveis ao toque (touchscreen)",
      "Carregamos no bolso todos os dias para falar, fotografar e mandar mensagens"
    ],
    explicacao: "O smartphone se tornou o dispositivo eletrônico mais popular e indispensável da sociedade moderna."
  },
  {
    palavra: "Mouse",
    sinonimos: ["mouse", "rato", "mouse de computador"],
    categoria: "Hardware",
    pistas: [
      "Seu primeiro protótipo foi esculpido em um bloco de madeira por Douglas Engelbart",
      "Tem o mesmo nome em inglês de um pequeno roedor",
      "Serve para mover o cursor pela tela e dar cliques nos botões"
    ],
    explicacao: "O mouse foi inventado na década de 1960 e popularizado pela Xerox e pela Apple nos computadores pessoais."
  },
  {
    palavra: "Teclado",
    sinonimos: ["teclado", "teclado de computador", "teclado mecânico"],
    categoria: "Periféricos",
    pistas: [
      "O padrão mais comum de letras se chama QWERTY",
      "Herança direta das antigas máquinas de escrever mecânicas",
      "Possui teclas como Espaço, Enter, Shift e Backspace"
    ],
    explicacao: "O padrão QWERTY foi criado no século XIX para evitar que as hastes das máquinas de escrever batessem entre si."
  },
  {
    palavra: "Monitor",
    sinonimos: ["monitor", "tela", "display", "monitor de video", "ecra"],
    categoria: "Periféricos",
    pistas: [
      "No passado usava tubos de raios catódicos (CRT) volumosos e pesados",
      "Mede sua qualidade em resoluções como Full HD, 4K e taxa de hertz (Hz)",
      "É a tela onde você enxerga tudo o que o computador ou videogame está processando"
    ],
    explicacao: "Evoluímos dos monitores de fósforo verde monocromático para telas OLED e alta taxa de atualização."
  },
  {
    palavra: "Wi-Fi",
    sinonimos: ["wifi", "wi fi", "wi-fi", "rede sem fio", "wireless"],
    categoria: "Redes",
    pistas: [
      "Baseia-se no padrão técnico de ondas de rádio IEEE 802.11",
      "A atriz e inventora Hedy Lamarr ajudou a criar as bases dessa transmissão sem fio",
      "É o que você pede a senha quando chega na casa de um amigo para usar a internet"
    ],
    explicacao: "O Wi-Fi utiliza ondas de rádio para tráfego de dados e é encontrado em quase todas as casas e escolas."
  },
  {
    palavra: "Minecraft",
    sinonimos: ["minecraft"],
    categoria: "Games",
    pistas: [
      "Foi criado inicialmente por um desenvolvedor sueco conhecido como Notch",
      "Seu mundo infinito é gerado proceduralmente com blocos tridimensionais",
      "Possui o monstro explosivo Creeper e o chefão Ender Dragon"
    ],
    explicacao: "Minecraft é o jogo eletrônico mais vendido da história com centenas de milhões de cópias comercializadas."
  },
  {
    palavra: "Algoritmo",
    sinonimos: ["algoritmo", "algoritmos", "algorithm"],
    categoria: "Ciência da Computação",
    pistas: [
      "Seu nome homenageia o matemático persa Al-Khwarizmi do século IX",
      "É uma sequência finita de passos e regras para resolver um problema",
      "Pode ser comparado a uma receita de bolo para ensinar um computador a executar tarefas"
    ],
    explicacao: "Tudo o que roda em um software é guiado por algoritmos lógicos e estruturados."
  },
  {
    palavra: "Impressora 3D",
    sinonimos: ["impressora 3d", "impressora tridimensional", "impressao 3d"],
    categoria: "Cultura Maker",
    pistas: [
      "Funciona através da fabricação aditiva, depositando material camada por camada",
      "Utiliza filamentos plásticos como PLA e ABS ou resina fotossensível",
      "Permite criar e materializar objetos tridimensionais, peças e miniaturas"
    ],
    explicacao: "As impressoras 3D são o coração do movimento Maker, usadas na prototipagem, medicina e educação técnica."
  },
  {
    palavra: "Satélite",
    sinonimos: ["satelite", "satelites", "satelite artificial"],
    categoria: "Ciência Espacial",
    pistas: [
      "O primeiro construído pelo ser humano a ir ao espaço foi o Sputnik 1 em 1957",
      "Fica em órbita ao redor da Terra no vácuo do espaço",
      "Transmite sinais de GPS, previsão do tempo e imagens astronômicas"
    ],
    explicacao: "Satélites artificiais orbitam o planeta viabilizando telecomunicações, geolocalização e monitoramento ambiental."
  },
  {
    palavra: "Bateria",
    sinonimos: ["bateria", "baterias", "acumulador", "pilha recarregavel"],
    categoria: "Eletrônica",
    pistas: [
      "A invenção inicial foi a pilha de Alessandro Volta com discos de zinco e cobre",
      "Converte energia química armazenada em energia elétrica para alimentar circuitos",
      "Nos celulares modernos é de íons de lítio e você precisa recarregar na tomada"
    ],
    explicacao: "As baterias de lítio tornaram possível a revolução da computação móvel e dos veículos elétricos."
  },
  {
    palavra: "Bluetooth",
    sinonimos: ["bluetooth"],
    categoria: "Tecnologia",
    pistas: [
      "Seu nome e logotipo homenageiam um rei viking dinamarquês dos anos 900",
      "É um protocolo de comunicação sem fio para conexões de curto alcance",
      "Conecta caixinhas de som, fones de ouvido e smartwatches ao celular"
    ],
    explicacao: "Harald 'Dente-Azul' (Bluetooth) unificou tribos escandinavas, assim como a tecnologia unifica dispositivos."
  },
  {
    palavra: "Energia Solar",
    sinonimos: ["energia solar", "energia fotovoltaica", "painel solar", "painel fotovoltaico", "luz solar"],
    categoria: "Sustentabilidade",
    pistas: [
      "É uma fonte limpa, renovável e inesgotável originada a cerca de 150 milhões de km da Terra",
      "Utiliza placas com células fotovoltaicas feitas de silício",
      "Gera eletricidade a partir da luz do Sol"
    ],
    explicacao: "A energia solar cresce fortemente no Brasil e no mundo como pilar da transição ecológica sustentável."
  },
  {
    palavra: "Óculos de Realidade Virtual",
    sinonimos: ["oculos vr", "realidade virtual", "vr", "oculos de realidade virtual", "headset vr", "oculos de rv"],
    categoria: "Inovação",
    pistas: [
      "Utiliza sensores de movimento de giroscópio e duas lentes estereoscópicas",
      "Mergulha o usuário em um ambiente 3D totalmente simulado e interativo",
      "Você veste na cabeça sobre os olhos para jogar ou treinar simulações imersivas"
    ],
    explicacao: "A Realidade Virtual (VR) transporta o jogador para dentro de universos simulados com perspectiva 360°."
  },
  {
    palavra: "Foguete",
    sinonimos: ["foguete", "foguetes", "veiculo lancador", "nave espacial", "foguete espacial"],
    categoria: "Aeroespacial",
    pistas: [
      "Funciona com base na Terceira Lei de Newton: para toda ação há uma reação oposta",
      "Queima propelente em altíssima velocidade para vencer a gravidade da Terra",
      "Transporta astronautas e cargas até a Lua, estações espaciais e outros planetas"
    ],
    explicacao: "Foguetes como o Saturn V e o Falcon 9 são máquinas extraordinárias que abriram a era espacial humana."
  },
  {
    palavra: "Microfone",
    sinonimos: ["microfone", "mic"],
    categoria: "Áudio & Mídia",
    pistas: [
      "É um transdutor eletroacústico que capta ondas de pressão no ar",
      "Converte vibrações acústicas da voz em sinais elétricos digitais",
      "Cantores usam no palco e streamers usam para falar durante transmissões"
    ],
    explicacao: "O microfone permite registrar e transmitir a voz humana com alta fidelidade ao redor do mundo."
  },
  {
    palavra: "Energia Eólica",
    sinonimos: ["energia eolica", "eolica", "vento", "turbina eolica", "aerogerador"],
    categoria: "Sustentabilidade",
    pistas: [
      "Evoluiu a partir dos antigos moinhos de vento holandeses",
      "Gera eletricidade por meio de grandes pás que giram um aerogerador",
      "Aproveita a força dos ventos para produzir energia limpa"
    ],
    explicacao: "A energia eólica é uma das matrizes energéticas que mais cresce no Brasil, especialmente no litoral nordestino."
  },
  {
    palavra: "Câmera",
    sinonimos: ["camera", "camera fotografica", "maquina fotografica", "webcam"],
    categoria: "Fotografia & Óptica",
    pistas: [
      "Seus princípios ancestrais vêm da 'câmara escura' descrita na Antiguidade",
      "Possui lentes, diafragma e sensores como CMOS para registrar a luz",
      "Usada para tirar fotos, gravar vídeos e fazer chamadas no computador"
    ],
    explicacao: "Das primeiras chapas de daguerreótipo até as câmeras dos celulares atuais, capturamos memórias em imagens."
  },
  {
    palavra: "Drone",
    sinonimos: ["drone", "drones", "veiculo aereo nao tripulado", "vant", "quadricoptero"],
    categoria: "Tecnologia & Robótica",
    pistas: [
      "Classificado tecnicamente como VANT (Veículo Aéreo Não Tripulado)",
      "Possui geralmente quatro ou mais hélices e voa pilotado por controle remoto",
      "Faz filmagens aéreas incríveis, monitora lavouras e pode entregar pacotes"
    ],
    explicacao: "Os drones revolucionaram filmagens aéreas, agricultura de precisão, resgates e inspeções industriais."
  },
  {
    palavra: "Pendrive",
    sinonimos: ["pendrive", "pen drive", "memoria usb", "flash drive"],
    categoria: "Armazenamento",
    pistas: [
      "Substituiu os disquetes magnéticos e os CDs como mídia portátil",
      "Utiliza memória flash NAND que não perde os dados ao ser desligada",
      "Pequeno dispositivo portátil que se espeta na porta USB para levar arquivos"
    ],
    explicacao: "O pendrive facilitou o transporte de arquivos no bolso no início dos anos 2000."
  },
  {
    palavra: "Livro",
    sinonimos: ["livro", "livros", "obra literaria"],
    categoria: "Conhecimento & Cultura",
    pistas: [
      "Foi revolucionado na Europa no século XV pela prensa de tipos móveis de Johannes Gutenberg",
      "Pode ser físico com capa e páginas de papel ou digital no formato e-book",
      "É um conjunto de folhas encadernadas que contém histórias, estudos e poesias"
    ],
    explicacao: "A invenção da imprensa de Gutenberg popularizou os livros e permitiu a difusão da ciência e literatura."
  },
  {
    palavra: "Fones de Ouvido",
    sinonimos: ["fones de ouvido", "fone de ouvido", "fones", "headphone", "headset", "earphones", "auriculares"],
    categoria: "Periféricos",
    pistas: [
      "Possuem pequenos alto-falantes chamados transdutores acoplados às orelhas",
      "Podem ter cancelamento ativo de ruído (ANC) e conexão com fio ou sem fio",
      "Você coloca nos ouvidos para ouvir suas músicas favoritas sem incomodar os outros"
    ],
    explicacao: "Os fones de ouvido tornaram a audição musical uma experiência intimista e pessoal."
  },
  {
    palavra: "Semáforo",
    sinonimos: ["semaforo", "farol", "sinal", "sinal de transito", "sinaleira"],
    categoria: "Cidade Inteligente",
    pistas: [
      "O primeiro operava com gás e foi instalado em Londres em 1868",
      "Funciona com temporizadores e circuitos eletrônicos automáticos nas esquinas",
      "Usa as cores verde, amarela e vermelha para controlar o trânsito de veículos e pedestres"
    ],
    explicacao: "Os semáforos modernos utilizam sensores e até inteligência artificial para otimizar o fluxo de trânsito urbano."
  },
  {
    palavra: "E-mail",
    sinonimos: ["email", "e-mail", "correio eletronico"],
    categoria: "Comunicação",
    pistas: [
      "O primeiro foi enviado em 1971 pelo programador Ray Tomlinson",
      "Ficou famoso por introduzir o símbolo da arroba (@) nos endereços digitais",
      "É uma mensagem eletrônica enviada pela internet através de caixas de entrada como Gmail ou Outlook"
    ],
    explicacao: "O e-mail foi um dos pilares fundadores da comunicação em rede e permanece essencial no mundo corporativo e acadêmico."
  },
  {
    palavra: "Telescópio",
    sinonimos: ["telescopio", "telescopios", "luneta"],
    categoria: "Ciência & Astronomia",
    pistas: [
      "Galileu Galilei aperfeiçoou seu uso para apontar ao céu e descobrir luas em Júpiter",
      "Usa espelhos refletores côncavos ou lentes refratoras para captar fótons distantes",
      "Modelos famosos como Hubble e James Webb revelam galáxias e estrelas distantes"
    ],
    explicacao: "O telescópio ampliou a visão da humanidade sobre o cosmos, revelando planetas, nebulosas e a história do universo."
  },
  {
    palavra: "Criptografia",
    sinonimos: ["criptografia", "criptografado", "cripto", "cifra"],
    categoria: "Segurança Digital",
    pistas: [
      "Júlio César usava uma versão primitiva dela para enviar cartas secretas aos generais",
      "Usa chaves matemáticas públicas e privadas para codificar e decodificar dados",
      "Protege suas senhas, transações bancárias e mensagens no WhatsApp para que ninguém possa espionar"
    ],
    explicacao: "A criptografia moderna é a base da segurança da informação em toda a internet e sistemas bancários."
  }
];

// Torna disponível globalmente ou via exportação
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PISTAS_PADRAO };
}
