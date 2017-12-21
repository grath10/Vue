package com.vue.admin.tools;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.vue.admin.service.PerfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class PdfUtils {
    public static int maxWidth = 520;
    public static Font keyfont;
    public static Font textfont;
    public static Font headfont;
    public static PdfUtils pdfUtils;

    static {
        BaseFont bf;
        try {
            bf = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
            keyfont = new Font(bf, 8, Font.BOLD);
            headfont = new Font(bf, 12, Font.NORMAL);
            textfont = new Font(bf, 8, Font.NORMAL);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Autowired
    private PerfService perfService;

    // 通过png文件生成pdf文件
    public static File createPdf(String imagePath, String pdfName) {
        try {
            FileOutputStream outputStream = new FileOutputStream(pdfName);
            Document doc = new Document(PageSize.A4, 20, 20, 20, 20);
            try {
                PdfWriter.getInstance(doc, outputStream);
            } catch (DocumentException e) {
                e.printStackTrace();
            }
            doc.open();
            doc.add(new Paragraph("曲线图", headfont));
            addEcharts(imagePath, doc);
        } catch (Exception e) {
            e.printStackTrace();
        }
        File pdfFile = new File(pdfName);
        if (!pdfFile.exists()) {
            pdfFile.deleteOnExit();
            return null;
        }
        return pdfFile;
    }

    // 下载pdf文件
    public static void downloadPdf(String imagePath, String params, String type, HttpServletResponse response) {
        Document doc = null;
        try {
            response.setContentType("application/pdf");
            OutputStream outputStream = response.getOutputStream();
            doc = new Document(PageSize.A4, 20, 20, 20, 20);
            try {
                PdfWriter.getInstance(doc, outputStream);
            } catch (DocumentException e) {
                e.printStackTrace();
            }
            doc.open();
            PdfPCell header = new PdfPCell(new Paragraph("曲线图", headfont));
            header.setBorder(0);
            PdfPTable table = new PdfPTable(1);
            table.getDefaultCell().setBorder(0);
            table.addCell(header);
            table = addEcharts(imagePath, table);
            PdfPCell tableHeader = new PdfPCell(new Paragraph("数据表格", headfont));
            tableHeader.setBorder(0);
            table.addCell(tableHeader);
            table = createDataTable(params, type, table);
            doc.add(table);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            doc.close();
        }
    }

    public static PdfPTable createDataTable(String params, String type, PdfPTable layout) {
        Map<String, String> map = extractParams(params, type);
        String device = map.get("device");
        String day = map.get("selectedTime");
        String perf = map.get("perf");
        String index = map.get("index");
        if ("device".equals(type)) {
            String[] titles = new String[]{"collecttime", "avgTemp", "maxTemp", "minTemp", "avgHumid", "maxHumid", "minHumid", "avgGas", "maxGas", "minGas"};
            List<List<String>> dataList = pdfUtils.perfService.formatCollectedData(device, day, titles);
            String[] head = new String[]{"序号", "采样时间", "温度", "湿度", "氨气浓度", "均值", "上限值", "下限值", "均值", "上限值", "下限值", "均值", "上限值", "下限值"};
            return generateTable(head, dataList, 11, layout, type);
        } else {
            String[] devices = device.split(",");
            perf = index + perf;
            String[] head = new String[]{"序号", "采样时间"};
            List<String> list = new ArrayList<>(Arrays.asList(head));
            for (int i = 0; i < devices.length; i++) {
                list.add(devices[i]);
            }
            List<List<String>> dataList = pdfUtils.perfService.formatCollectedDataByType(device, day, perf);
            head = list.toArray(new String[0]);
            return generateTable(head, dataList, head.length, layout, type);
        }
    }

    /*
        selectedTime=2017-11-28&perf=Temp&index=avg&device=171101-01
        selectedTime=2017-11-28&perf=Temp&device=171120-00
     */
    public static Map<String, String> extractParams(String params, String type) {
        String[] keys = null;
        Map<String, String> map = new HashMap<>();
        if ("device".equals(type)) {
            keys = new String[]{"selectedTime", "perf", "device"};
        } else if ("type".equals(type)) {
            keys = new String[]{"selectedTime", "perf", "index", "device"};
        }
        int num = keys.length;
        for (int i = 0; i < num; i++) {
            String key = keys[i];
            Pattern pattern = null;
            if (i != num - 1) {
                pattern = Pattern.compile(key + "=(.*?)(?=&" + keys[i + 1] + ")");
            } else {
                pattern = Pattern.compile(key + "=(.*?)$");
            }
            Matcher matcher = pattern.matcher(params);
            if (matcher.find()) {
                String value = matcher.group(1);
                map.put(key, value);
            }
        }
        return map;
    }

    // 下载pdf文件
    public static void downloadPdf2(String imagePath, HttpServletResponse response) {
        Document doc = null;
        try {
            response.setContentType("application/pdf");
            OutputStream outputStream = response.getOutputStream();
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            doc = new Document(PageSize.A4, 20, 20, 20, 20);
            try {
                PdfWriter.getInstance(doc, outputStream);
            } catch (DocumentException e) {
                e.printStackTrace();
            }
            doc.open();
            BaseFont bf = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
            Font font = new Font(bf, 12, Font.NORMAL);
            doc.add(new Paragraph("曲线图", font));
            addEcharts(imagePath, doc);
            DataOutput output = new DataOutputStream(outputStream);
            byte[] bytes = buffer.toByteArray();
            response.setContentLength(bytes.length);
            for (int i = 0; i < bytes.length; i++) {
                output.writeByte(bytes[i]);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            doc.close();
        }
    }

    public static void downloadPdfTable() {
        Document doc = null;
        try {
            doc = new Document(PageSize.A4, 20, 20, 20, 20);
            File file = new File("export.pdf");
            if (!file.exists()) {
                file.createNewFile();
            }
            try {
                FileOutputStream outputStream = new FileOutputStream(file);
                PdfWriter writer = PdfWriter.getInstance(doc, outputStream);
            } catch (DocumentException e) {
                e.printStackTrace();
            }
            doc.open();
            BaseFont bf = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
            Font font = new Font(bf, 12, Font.NORMAL);
            doc.add(new Paragraph("曲线图", font));
            String[] head = new String[]{"序号", "采样时间", "温度", "湿度", "氨气浓度", "均值", "上限值", "下限值", "均值", "上限值", "下限值", "均值", "上限值", "下限值"};
            List<List<String>> list = new ArrayList<>();
            List<String> dataList = new ArrayList<>();
            for (int i = 0; i < 11; i++) {
                dataList.add(i + "");
            }
            list.add(dataList);
            generateTable(head, list, 11, doc);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            doc.close();
        }
    }

    private static PdfPTable addEcharts(String imagePath, PdfPTable table) throws IOException, DocumentException {
        if (imagePath != null && imagePath.startsWith("data:image/png;base64")) {
            final String base64Data = imagePath.substring(imagePath.indexOf(",") + 1);
            Image img = Image.getInstance(Base64.getDecoder().decode(base64Data));
            float weight = img.getWidth();
            int percent = getPercent(weight);
            img.setAlignment(Image.MIDDLE);
            img.setAlignment(Image.TEXTWRAP);
            img.scalePercent(percent + 3);
            table.addCell(img);
        }
        return table;
    }

    private static Document addEcharts(String imagePath, Document doc) throws IOException, DocumentException {
        if (imagePath != null && imagePath.startsWith("data:image/png;base64")) {
            final String base64Data = imagePath.substring(imagePath.indexOf(",") + 1);
            Image img = Image.getInstance(Base64.getDecoder().decode(base64Data));
            float weight = img.getWidth();
            int percent = getPercent(weight);
            img.setAlignment(Image.MIDDLE);
            img.setAlignment(Image.TEXTWRAP);
            img.scalePercent(percent + 3);
            doc.add(img);
        }
        return doc;
    }

    public static PdfPCell createCell(String value, Font font, int align) {
        PdfPCell cell = new PdfPCell();
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setHorizontalAlignment(align);
        cell.setPhrase(new Phrase(value, font));
        return cell;
    }

    public static PdfPCell createCell(String value, Font font, int align, int rowspan) {
        PdfPCell cell = new PdfPCell();
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setHorizontalAlignment(align);
        cell.setPhrase(new Phrase(value, font));
        cell.setRowspan(rowspan);
        return cell;
    }

    /**
     * 为表格添加一个内容
     *
     * @param value      数值
     * @param font       字体
     * @param align      水平对齐方式
     * @param colspan    占多少列
     * @param borderFlag 是否有边框
     * @return 添加文本框
     */
    public static PdfPCell createCell(String value, Font font, int align, int colspan, boolean borderFlag) {
        PdfPCell cell = new PdfPCell();
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setHorizontalAlignment(align);
        cell.setColspan(colspan);
        cell.setPhrase(new Phrase(value, font));
        cell.setPadding(3.0f);
        if (!borderFlag) {
            cell.setBorder(0);
            cell.setPaddingTop(15.0f);
            cell.setPaddingBottom(8.0f);
        }
        return cell;
    }

    private static int getPercent(float w) {
        float p2 = 530 / w * 100;
        return Math.round(p2);
    }

    public static PdfPTable createTable(int colNumber) {
        PdfPTable table = new PdfPTable(colNumber);
        try {
            table.setTotalWidth(maxWidth);
            table.setLockedWidth(true);
            table.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.getDefaultCell().setBorder(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return table;
    }

    public static Document generateTable(String[] head, List<List<String>> list, int colNum, Document doc) {
        PdfPTable table = createTableHeader(head, colNum, "device");
        if (!CommonUtils.isEmpty(list)) {
            int size = list.size();
            for (int i = 0; i < size; i++) {
                List<String> dataList = list.get(i);
                for (int j = 0; j < colNum; j++) {
                    PdfPCell cell = createCell(dataList.get(j), textfont, Element.ALIGN_CENTER);
                    table.addCell(cell);
                }
            }
        }
        try {
            doc.add(table);
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return doc;
    }

    public static PdfPTable generateTable(String[] head, List<List<String>> list, int colNum, PdfPTable layout, String type) {
        PdfPTable table = createTableHeader(head, colNum, type);
        if (!CommonUtils.isEmpty(list)) {
            int size = list.size();
            for (int i = 0; i < size; i++) {
                List<String> dataList = list.get(i);
                for (int j = 0; j < colNum; j++) {
                    PdfPCell cell = null;
                    if(j == 0){
                        cell = createCell((i + 1) + "", textfont,Element.ALIGN_CENTER);
                    }else {
                        cell = createCell(dataList.get(j), textfont, Element.ALIGN_CENTER);
                    }
                    table.addCell(cell);
                }
            }
        }
        layout.addCell(table);
        return layout;
    }

    // 设置表头
    public static PdfPTable createTableHeader(String[] head, int colNum, String type) {
        PdfPTable table = new PdfPTable(colNum);
        int len = head.length;
        for (int i = 0; i < len; i++) {
            PdfPCell cell = createCell(head[i], keyfont, Element.ALIGN_CENTER);
            if("device".equals(type)) {
                if (i == 0 || i == 1) {
                    cell.setRowspan(2);
                } else if (i < 5) {
                    cell.setColspan(3);
                }
            }
            table.addCell(cell);
        }
        return table;
    }

    @PostConstruct
    public void init() {
        pdfUtils = this;
    }
}
