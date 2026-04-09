import type { ReactNode } from "react";
import brownLogoText from "../assets/icons/brown_logo_text.png";
import wiscLogo from "../assets/icons/wisc_logo.svg";
import profilePhoto from "../assets/photos/me.jpeg";

export type PageKey =
  | "overview"
  | "publications"
  | "honors"
  | "services"
  | "teaching"
  | "misc";

export type NavItem = {
  key: PageKey;
  label: string;
};

export type PageDefinition = {
  title: string;
  description: string;
  heading: string;
  content: ReactNode;
};

export const navItems: NavItem[] = [
  { key: "overview", label: "Overview" },
  { key: "publications", label: "Publications" },
  { key: "honors", label: "Honors & Awards" },
  { key: "services", label: "Services" },
  { key: "teaching", label: "Teaching" },
  { key: "misc", label: "Misc" },
];

export const pageDescriptions: Record<PageKey, string> = {
  overview: "I'm Xizheng Yu, a student at Brown University.",
  publications: "Publications and preprints by Xizheng Yu.",
  honors: "Honors and awards received by Xizheng Yu.",
  services: "Professional service by Xizheng Yu.",
  teaching: "Teaching experience of Xizheng Yu.",
  misc: "Miscellaneous interests and hobbies of Xizheng Yu.",
};

export const pages: Record<PageKey, PageDefinition> = {
  overview: {
    title: "Xizheng Yu",
    description: pageDescriptions.overview,
    heading: "Hi, this is Xizheng Yu",
    content: (
      <>
        <section className="intro-section">
          <div className="intro-content">
            <div className="photo-column">
              <img
                src={profilePhoto}
                alt="Xizheng Yu"
                className="profile-photo"
              />
              <div className="social-icons">
                <a href="mailto:xizheng_yu@brown.edu" title="Email">
                  <i className="fas fa-envelope" />
                </a>
                <a
                  href="https://scholar.google.com/citations?user=o74_zz0AAAAJ&hl=en"
                  target="_blank"
                  rel="noreferrer"
                  title="Google Scholar"
                >
                  <i className="fas fa-graduation-cap" />
                </a>
                <a
                  href="https://github.com/xzyu02"
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub"
                >
                  <i className="fab fa-github" />
                </a>
                <a
                  href="https://linkedin.com/in/xzyu"
                  target="_blank"
                  rel="noreferrer"
                  title="LinkedIn"
                >
                  <i className="fab fa-linkedin" />
                </a>
                <a
                  href="https://drive.google.com/drive/folders/17mvaTVcThuY9vmbqT7_zsLtoz0CiMGNo?usp=drive_link"
                  target="_blank"
                  rel="noreferrer"
                  title="CV"
                  className="social-text-link"
                >
                  CV
                </a>
              </div>
            </div>
            <div className="text-column">
              <p className="bio">
                Hi! I'm an incoming PhD student at Harvard University, advised by{" "}
                <a
                  href="https://sites.google.com/site/sueyeonchung/."
                  target="_blank"
                  rel="noreferrer"
                >
                  Prof. Sueyeon Chung
                </a>
                . I'm interested in understanding model representations through
                mechanistic intepretability, and building brain-inspired models
                that learn and generalize in more human-like ways.
                <br />
                <br />I am currently at{" "}
                <a href="https://www.brown.edu/" target="_blank" rel="noreferrer">
                  <img
                    src={brownLogoText}
                    alt="Brown"
                    className="school-logo"
                  />
                </a>
                pursuing my Sc.M. in Computer Science, working with{" "}
                <a
                  href="https://vivo.brown.edu/display/tserre"
                  target="_blank"
                  rel="noreferrer"
                >
                  Prof. Thomas Serre
                </a>
                . Previously, I did my undergraduate studies at{" "}
                <a href="https://www.wisc.edu/" target="_blank" rel="noreferrer">
                  <img
                    src={wiscLogo}
                    alt="UW-Madison"
                    className="school-logo"
                  />
                </a>
                with a triple major in Computer Sciences, Mathematics, and Data
                Science, where I worked with{" "}
                <a
                  href="https://www.biostat.wisc.edu/~vsingh/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Prof. Vikas Singh
                </a>{" "}
                and{" "}
                <a
                  href="https://psych.wisc.edu/staff/rogers-timothy-t/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Prof. Timothy T. Rogers
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>News</h2>
          <div className="content-box compact">
            <p>
              <strong>May 2026</strong> - I'm graduating from Brown.
            </p>
            <p>
              <strong>Apr 2026</strong> - I accepted my PhD offer at Harvard.
            </p>
          </div>
        </section>
      </>
    ),
  },
  publications: {
    title: "Publications | Xizheng Yu",
    description: pageDescriptions.publications,
    heading: "Publications & Preprints",
    content: (
      <div className="content-box">
        <p>
          [1] I. Felipe*, <strong>X. Yu*</strong>, J. Mulinken, N. Pant, T. Serre
          <br />
          <strong>
            HMAX Strikes Back: Biologically-Inspired Architectures For Scale
            Invariance
          </strong>
          <br />
          <em>Under Review</em>
        </p>

        <p className="spaced-paragraph">
          [2] <strong>X. Yu</strong>, J. Torok, S. Pandya, S. Pal, V. Singh, A.
          Raj
          <br />
          <strong>
            Brain-wide interpolation and conditioning of gene expression in the
            human brain using Implicit Neural Representations
          </strong>
          <br />
          <em>
            <a href="https://arxiv.org/abs/2506.11158" target="_blank" rel="noreferrer">
              Preprint
            </a>
          </em>
        </p>

        <p className="spaced-paragraph">
          [3] S. Suresh, K. Mukherjee, T. Giallanza, <strong>X. Yu</strong>, M.
          Patil, J. Cohen, T. T. Rogers
          <br />
          <strong>AI-enhanced semantic feature norms for 786 concepts</strong>
          <br />
          <em>
            Cogsci 2025 &{" "}
            <a href="https://iclr.cc/virtual/2025/34162" target="_blank" rel="noreferrer">
              ICLR 2025 Bi-Align
            </a>
          </em>
          <br />
          <strong>Best Paper Award</strong>
        </p>

        <p className="spaced-paragraph">
          [4] K. Mukherjee, S. Suresh, <strong>X. Yu</strong>, G. Lupyan
          <br />
          <strong>
            The role of shared labels and experiences in representational
            alignment
          </strong>
          <br />
          <em>
            <a href="https://iclr.cc/virtual/2024/22553" target="_blank" rel="noreferrer">
              ICLR 2024 Re-Align
            </a>
          </em>
        </p>

        <p className="spaced-paragraph">
          [5] S. Suresh, K. Mukherjee, <strong>X. Yu</strong>, W. Huang, L.
          Padua, T. T. Rogers
          <br />
          <strong>
            Conceptual structure coheres in human cognition but not in large
            language model
          </strong>
          <br />
          <em>
            <a
              href="https://aclanthology.org/2023.emnlp-main.47/"
              target="_blank"
              rel="noreferrer"
            >
              EMNLP 2023
            </a>
          </em>
        </p>
      </div>
    ),
  },
  honors: {
    title: "Honors & Awards | Xizheng Yu",
    description: pageDescriptions.honors,
    heading: "Honors & Awards",
    content: (
      <div className="content-box compact">
        <p>
          <strong>Best Paper Award</strong> @ Bidirectional Human AI Alignment
          Workshop ICLR 2025 and CHI 2025
        </p>
        <p>
          <strong>Computational Modeling Prize for Applied Cognition</strong> @
          Cogsci 2025
        </p>
        <p>
          <strong>Distinction in the Major</strong> @ UW-Madison Computer
          Science
        </p>
      </div>
    ),
  },
  services: {
    title: "Services | Xizheng Yu",
    description: pageDescriptions.services,
    heading: "Services",
    content: (
      <div className="content-box compact">
        <p>
          Reviewer, <em>CogSci 2025, 2026</em>
        </p>
        <p>
          Reviewer,{" "}
          <em>ICLR 2025 Workshop on Representational Alignment (Re-Align)</em>
        </p>
      </div>
    ),
  },
  teaching: {
    title: "Teaching | Xizheng Yu",
    description: pageDescriptions.teaching,
    heading: "Teaching Experience",
    content: (
      <div className="content-box compact">
        <p>
          <strong>At Brown</strong>
        </p>
        <p className="date-line indented-row">
          <span>CPSY 1291: Computational Methods for Mind, Brain and Behavior</span>
          <span>Fall 25</span>
        </p>

        <p>
          <strong>At Wisc</strong>
        </p>
        <p className="date-line indented-row">
          <span>CS 320: Data Science Programming II</span>
          <span>Spring 23</span>
        </p>
        <p className="date-line indented-row">
          <span>CS 400: Algorithms and Data Structures in Java</span>
          <span>Fall 22</span>
        </p>
        <p className="date-line indented-row">
          <span>Math 234: Multi-variable Calculus</span>
          <span>Fall 22</span>
        </p>
      </div>
    ),
  },
  misc: {
    title: "Misc | Xizheng Yu",
    description: pageDescriptions.misc,
    heading: "Misc",
    content: (
      <div className="content-box compact">
        <p>In my spare time, I do a lot of stuff.</p>
        <p>🎾 I enjoy playing (a lot of) tennis, and I play with a blue Yonex Ezone 98 racquet.</p>
        <p>
          🍳 I love cooking Chinese food, and I also enjoy experimenting with new
          recipes and cuisines.
        </p>
        <p>🏎️ I'm a big Formula 1 fan.</p>
        <p>
          🕹️ I made this cute game with Gemini 3. Check out my{" "}
          <a href="./flappy-react/dist/index.html">Flappy Bird</a>!
        </p>
      </div>
    ),
  },
};
