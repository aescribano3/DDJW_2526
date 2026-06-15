# DDJW_2526 - Joc de Memòria

## Introducció

Aquest projecte consisteix en el desenvolupament d'un joc de memòria utilitzant JavaScript, HTML5 Canvas i CSS. El joc parteix de la base implementada durant les sessions de teoria i ha estat ampliat amb nous modes de joc, un sistema de puntuacions, personalització de les opcions i un sistema de guardar i carregar partides.

L'objectiu principal del joc és descobrir grups de cartes iguals abans que s'acabi el temps disponible, obtenint la màxima puntuació possible.

---

## Disseny del joc

El joc disposa de dos modes de joc diferents:

### Mode 1

El jugador selecciona:

* Nombre de cartes.
* Dificultat.
* Mida del grup (parelles, trios o quartets).

Un cop configurada la partida, es genera un nivell amb les opcions escollides.

### Mode 2

Es tracta d'un mode progressiu.

Cada vegada que el jugador supera un nivell:

* Augmenta el nombre de cartes.
* Es redueix el temps disponible.
* Augmenten les penalitzacions.
* Es modifica progressivament la mida dels grups.

L'objectiu és arribar tan lluny com sigui possible acumulant la màxima puntuació.

### Interfície

El menú principal permet:

* Iniciar una partida.
* Consultar les puntuacions.
* Carregar una partida guardada.

Totes les pantalles comparteixen una mateixa estètica visual basada en targetes, colors coherents i una interfície senzilla.

---

## Parts rellevants de la implementació

### Canvas

El joc està implementat utilitzant HTML5 Canvas per representar les cartes i gestionar la interacció amb el jugador.

### Sistema de grups

Les cartes es generen dinàmicament segons la mida de grup seleccionada:

* Parelles.
* Trios.
* Quartets.

Aquesta funcionalitat és utilitzada tant pel Mode 1 com pel Mode 2.

### Sistema de puntuació

El joc calcula una puntuació en funció dels encerts, errors i dificultat seleccionada.

Les puntuacions del Mode 2 es guarden associades a l'àlies introduït pel jugador.

### Ranking

Les puntuacions es guarden localment i es mostren ordenades de major a menor en la pantalla de puntuacions.

### Guardar i carregar

Les partides es guarden localment mitjançant LocalStorage.

Es poden carregar posteriorment des de la pantalla de càrrega mantenint l'estat de la partida.

---

## Conclusions i problemes trobats

Durant el desenvolupament s'han hagut d'adaptar diferents parts del projecte original per donar suport als nous modes de joc i al sistema de grups.

Les principals dificultats han estat:

* Gestionar diferents mides de grup.
* Implementar la progressió automàtica del Mode 2.
* Integrar el sistema de guardar i carregar partides.
* Unificar l'estètica visual de totes les pantalles.

Finalment s'ha aconseguit implementar tots els requisits principals del treball mantenint una estructura modular i fàcil de mantenir.
